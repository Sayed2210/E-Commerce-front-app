<script setup lang="ts">
import { useAddresses } from '~/composables/useAddresses'
import { useCheckout } from '~/composables/useCheckout'
import type { PaymentMethod, ApplyCouponResponse } from '~/types/api'
import { showErrorToast, showSuccessToast } from '~/utils/errorHandler'

definePageMeta({ layout: 'default', middleware: 'auth' })
useSeoMeta({ title: 'Checkout — ArchitectMarket', robots: 'noindex, nofollow' })

const router = useRouter()
const cartStore = useCartStore()

const { getAddresses, createAddress } = useAddresses()
const { createOrder } = useCheckout()
const { resendVerification } = useAuth()

const { data: addressData, refresh: refreshAddresses } = await getAddresses()
const addresses = computed(() => addressData.value ?? [])

const selectedAddressId = ref<string | null>(
  addresses.value.find((a) => a.isDefault)?.id ?? addresses.value[0]?.id ?? null
)
const paymentMethod = ref<PaymentMethod>('cash_on_delivery')
const couponDiscount = ref(0)
const couponCode = ref('')
const placingOrder = ref(false)
const emailNotVerified = ref(false)
const resendingVerification = ref(false)

function handleCouponApplied(result: ApplyCouponResponse & { code: string }) {
  couponCode.value = result.code
  couponDiscount.value =
    result.type === 'fixed'
      ? result.discountValue
      : (cartStore.subtotal * result.discountValue) / 100
}

const shippingFee = computed(() => (cartStore.subtotal >= 99 ? 0 : 9.99))

async function handlePlaceOrder() {
  if (!selectedAddressId.value) {
    showErrorToast({ message: 'Please select a shipping address.' })
    return
  }
  placingOrder.value = true
  const { data, error } = await createOrder({
    shippingAddressId: selectedAddressId.value,
    paymentMethod: paymentMethod.value,
    couponCode: couponCode.value || undefined,
  })
  placingOrder.value = false

  if (error) {
    const status =
      (error as { response?: { status: number }; statusCode?: number })?.response?.status ??
      (error as { statusCode?: number })?.statusCode
    if (status === 403) {
      emailNotVerified.value = true
      showErrorToast({ message: 'Please verify your email before placing an order.' })
    } else {
      showErrorToast(error)
    }
    return
  }

  if (data?.clientSecret) {
    showErrorToast({ message: 'Stripe payment is not yet available. Please use Cash on Delivery.' })
    return
  }

  if (data?.order) {
    cartStore.$reset?.()
    router.push(`/orders/${data.order.id}`)
  }
}

async function handleResendVerification() {
  resendingVerification.value = true
  const ok = await resendVerification()
  resendingVerification.value = false
  if (ok) {
    showSuccessToast('Verification email sent — check your inbox.')
  } else {
    showErrorToast({ message: 'Could not send verification email. Try again later.' })
  }
}

async function handleAddAddress(dto: Parameters<typeof createAddress>[0]) {
  const { error } = await createAddress(dto)
  if (error) {
    showErrorToast(error)
    return
  }
  await refreshAddresses()
  if (!selectedAddressId.value && addresses.value.length) {
    selectedAddressId.value = addresses.value[0]!.id
  }
}

const breadcrumbs = [
  { label: 'Marketplace', to: '/' },
  { label: 'Cart', to: '/cart' },
  { label: 'Checkout' },
]
</script>

<template>
  <div class="checkout-page">
    <AppBreadcrumb :items="breadcrumbs" />

    <CheckoutStepper :step="1" />

    <!-- Email not verified banner -->
    <div v-if="emailNotVerified" class="checkout-page__verify-banner" role="alert">
      <span class="material-symbols-outlined" aria-hidden="true">mail</span>
      <span class="checkout-page__verify-text">
        Your email is not verified. Please check your inbox or
        <button
          type="button"
          class="checkout-page__verify-resend"
          :disabled="resendingVerification"
          @click="handleResendVerification"
        >
          {{ resendingVerification ? 'Sending…' : 'resend the verification email' }}</button
        >.
      </span>
    </div>

    <div class="checkout-page__layout">
      <section class="checkout-page__main">
        <div class="checkout-page__section">
          <CheckoutAddressPicker
            v-model="selectedAddressId"
            :addresses="addresses"
            @add="handleAddAddress"
          />
        </div>

        <div class="checkout-page__section">
          <CheckoutPaymentMethodSelector v-model="paymentMethod" />
        </div>

        <div class="checkout-page__section">
          <h2 class="checkout-page__section-title">Coupon</h2>
          <CheckoutCouponInput @applied="handleCouponApplied" />
        </div>
      </section>

      <CheckoutOrderReviewPanel
        :items="cartStore.items"
        :subtotal="cartStore.subtotal"
        :discount="cartStore.discount"
        :coupon-discount="couponDiscount"
        :shipping-fee="shippingFee"
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
}

.checkout-page__section-title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}
</style>
