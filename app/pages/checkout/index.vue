<script setup lang="ts">
import { useAddresses } from '~/composables/useAddresses'
import { useCheckout } from '~/composables/useCheckout'
import { useCurrency } from '~/composables/useCurrency'
import { useShipping } from '~/composables/useShipping'
import type {
  PaymentMethod,
  ApplyCouponResponse,
  ValidateCheckoutResponse,
  RedeemPointsDto,
} from '~/types/api'

const { t } = useI18n()
const { showError, showSuccess } = useToasts()

definePageMeta({ layout: 'default', middleware: 'auth' })
useSeoMeta({ title: () => t('checkout.title'), robots: 'noindex, nofollow' })

const config = useRuntimeConfig()
const router = useRouter()
const cartStore = useCartStore()

const { getAddresses, createAddress } = useAddresses()
const { validateCheckout, createOrder } = useCheckout()
const { resendVerification } = useAuth()
const { currentCurrency } = useCurrency()
const { calculateShipping } = useShipping()

const { data: addressData, refresh: refreshAddresses } = await getAddresses()
const addresses = computed(() => addressData.value ?? [])

const selectedAddressId = ref<string | null>(
  addresses.value.find((a) => a.isDefault)?.id ?? addresses.value[0]?.id ?? null
)
const paymentMethod = ref<PaymentMethod>('cod')
const couponCode = ref('')
const couponDiscount = ref(0)
const freeShipping = ref(false)
const placingOrder = ref(false)
const emailNotVerified = ref(false)
const resendingVerification = ref(false)
const validatedTotals = ref<ValidateCheckoutResponse | null>(null)
const redeemPointsDto = ref<RedeemPointsDto | null>(null)
const calculatedShipping = ref<number | null>(null)
const shippingLoading = ref(false)

const stripeCardRef = useTemplateRef<InstanceType<typeof StripeCardElement>>('stripeCard')
const stripePublishableKey = config.public.stripePublishableKey as string

function handleCouponApplied(result: ApplyCouponResponse & { code: string }) {
  couponCode.value = result.code
  if (result.type === 'free_shipping') {
    freeShipping.value = true
    couponDiscount.value = 0
  } else if (result.type === 'percentage') {
    freeShipping.value = false
    couponDiscount.value = (cartStore.subtotal * result.value) / 100
  } else {
    freeShipping.value = false
    couponDiscount.value = result.value
  }
  validatedTotals.value = null
}

async function runValidate() {
  if (!selectedAddressId.value) return
  const { data } = await validateCheckout({
    shippingAddressId: selectedAddressId.value,
    paymentMethod: paymentMethod.value,
    // couponCode: couponCode.value || undefined,
  })
  if (data) validatedTotals.value = data
}

watch(selectedAddressId, async (newId) => {
  validatedTotals.value = null
  calculatedShipping.value = null
  if (newId) {
    shippingLoading.value = true
    const { data } = await calculateShipping(newId, 1, cartStore.subtotal)
    if (data) {
      calculatedShipping.value = data.freeShipping ? 0 : data.cost
    }
    shippingLoading.value = false
  }
})

const displayShipping = computed(() => {
  if (freeShipping.value) return 0
  if (validatedTotals.value) return validatedTotals.value.shippingAmount
  if (calculatedShipping.value !== null) return calculatedShipping.value
  return null
})
const displayDiscount = computed(() => {
  if (validatedTotals.value) return validatedTotals.value.discountAmount
  return couponDiscount.value + cartStore.discount
})
const displayTax = computed(() => (validatedTotals.value ? validatedTotals.value.taxAmount : null))
const displayTotal = computed(() =>
  validatedTotals.value ? validatedTotals.value.totalAmount : null
)

async function handlePlaceOrder() {
  if (!selectedAddressId.value) {
    showError(null, t('checkout.selectShippingAddress'))
    return
  }

  if (!validatedTotals.value) {
    const { data, error } = await validateCheckout({
      shippingAddressId: selectedAddressId.value,
      paymentMethod: paymentMethod.value,
      // couponCode: couponCode.value || undefined,
    })
    if (error) {
      showError(error)
      return
    }
    validatedTotals.value = data
  }

  placingOrder.value = true

  if (paymentMethod.value === 'stripe') {
    await handleStripeOrder()
  } else {
    await handleCodOrder()
  }

  placingOrder.value = false
}

async function handleCodOrder() {
  const { data, error } = await createOrder({
    shippingAddressId: selectedAddressId.value!,
    paymentMethod: 'cod',
    couponCode: couponCode.value || undefined,
    currencyCode: currentCurrency.value.code,
    redeemPoints: redeemPointsDto.value?.points,
    redemptionType: redeemPointsDto.value?.redemptionType,
  })
  if (error) {
    handleOrderError(error)
    return
  }
  if (data?.order) {
    cartStore.clearCart()
    router.push(`/orders/${data.order.id}`)
  }
}

async function handleStripeOrder() {
  const stripeCard = stripeCardRef.value
  if (!stripeCard?.ready) {
    showError(null, t('checkout.cardNotReady'))
    return
  }

  const { data, error } = await createOrder({
    shippingAddressId: selectedAddressId.value!,
    paymentMethod: 'stripe',
    couponCode: couponCode.value || undefined,
    currencyCode: currentCurrency.value.code,
    redeemPoints: redeemPointsDto.value?.points,
    redemptionType: redeemPointsDto.value?.redemptionType,
  })

  if (error) {
    handleOrderError(error)
    return
  }

  const paymentIntentId = data?.paymentIntentId ?? data?.order?.paymentIntentId
  if (!paymentIntentId) {
    showError(null, t('checkout.noPaymentIntent'))
    return
  }

  try {
    await stripeCard.confirmCard(paymentIntentId)
    cartStore.clearCart()
    router.push(`/orders/${data!.order.id}`)
  } catch (err) {
    showError(err, t('checkout.paymentFailed'))
  }
}

function handleOrderError(error: unknown) {
  const status =
    (error as { response?: { status: number }; statusCode?: number })?.response?.status ??
    (error as { statusCode?: number })?.statusCode
  if (status === 403) {
    emailNotVerified.value = true
    showError(null, t('checkout.verifyEmailBeforeOrder'))
  } else {
    showError(error)
  }
}

async function handleResendVerification() {
  resendingVerification.value = true
  const ok = await resendVerification()
  resendingVerification.value = false
  if (ok) {
    showSuccess(t('checkout.verificationEmailSent'))
  } else {
    showError(null, t('checkout.resendVerificationFailed'))
  }
}

async function handleAddAddress(dto: Parameters<typeof createAddress>[0]) {
  const { error } = await createAddress(dto)
  if (error) {
    showError(error)
    return
  }
  await refreshAddresses()
  if (!selectedAddressId.value && addresses.value.length) {
    selectedAddressId.value = addresses.value[0]!.id
  }
}

const breadcrumbs = [
  { label: t('checkout.marketplace'), to: '/' },
  { label: t('checkout.cart'), to: '/cart' },
  { label: t('checkout.checkout') },
]
</script>

<template>
  <div class="checkout-page">
    <AppBreadcrumb :items="breadcrumbs" />

    <CheckoutStepper :step="1" />

    <div v-if="emailNotVerified" class="checkout-page__verify-banner" role="alert">
      <span class="material-symbols-outlined" aria-hidden="true">mail</span>
      <span class="checkout-page__verify-text">
        {{ $t('checkout.emailNotVerified') }}
        <button
          type="button"
          class="checkout-page__verify-resend"
          :disabled="resendingVerification"
          @click="handleResendVerification"
        >
          {{
            resendingVerification ? $t('checkout.sending') : $t('checkout.resendVerificationEmail')
          }}</button
        >.
      </span>
    </div>

    <div class="checkout-page__layout">
      <section class="checkout-page__main">
        <div class="checkout-page__section">
          <AddressPicker
            v-model="selectedAddressId"
            :addresses="addresses"
            @add="handleAddAddress"
          />
        </div>

        <div class="checkout-page__section">
          <PaymentMethodSelector v-model="paymentMethod" />
          <StripeCardElement
            v-if="paymentMethod === 'stripe' && stripePublishableKey"
            ref="stripeCard"
            :publishable-key="stripePublishableKey"
            class="checkout-page__stripe"
          />
        </div>

        <div class="checkout-page__section">
          <h2 class="checkout-page__section-title">{{ $t('checkout.coupon') }}</h2>
          <CouponInput @applied="handleCouponApplied" />
        </div>

        <div class="checkout-page__section">
          <PointsRedemption
            :cart-total="cartStore.subtotal"
            @update:redeem="redeemPointsDto = $event"
          />
        </div>

        <button
          v-if="selectedAddressId && !validatedTotals"
          type="button"
          class="checkout-page__validate-btn"
          @click="runValidate"
        >
          <span class="material-symbols-outlined" aria-hidden="true">calculate</span>
          {{ $t('checkout.calculateFinalTotals') }}
        </button>
      </section>

      <OrderReviewPanel
        :items="cartStore.items"
        :subtotal="cartStore.subtotal"
        :discount="displayDiscount"
        :coupon-discount="0"
        :shipping-fee="displayShipping ?? (freeShipping ? 0 : 9.99)"
        :tax="displayTax"
        :total-override="displayTotal"
        :loading="placingOrder"
        :email-not-verified="emailNotVerified"
        @place-order="handlePlaceOrder"
      />
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 1.5rem var(--container-pad) 4rem;
}

.checkout-page__verify-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: color-mix(in srgb, var(--color-primary-container) 40%, transparent);
  border-radius: var(--radius-DEFAULT);
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.checkout-page__verify-banner .material-symbols-outlined {
  font-size: 1.125rem;
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 0.1rem;
}

.checkout-page__verify-text {
  line-height: 1.5;
}

.checkout-page__verify-resend {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.checkout-page__verify-resend:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkout-page__layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (width >= 1024px) {
  .checkout-page__layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

.checkout-page__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.checkout-page__section {
  background: var(--color-surface-container-low);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.checkout-page__section-title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.checkout-page__stripe {
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
  padding-top: 1.25rem;
}

.checkout-page__validate-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  background: none;
  border: 1px solid color-mix(in srgb, var(--color-outline) 30%, transparent);
  border-radius: var(--radius-DEFAULT);
  padding: 0.625rem 1.25rem;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.checkout-page__validate-btn:hover {
  background: var(--color-surface-container-low);
}

.checkout-page__validate-btn .material-symbols-outlined {
  font-size: 1rem;
}
</style>
