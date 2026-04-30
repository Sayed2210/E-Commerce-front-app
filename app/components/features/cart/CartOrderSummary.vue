<script setup lang="ts">
defineProps<{
  subtotal: number
  discount: number
  total: number
}>()

const couponCode = ref('')
const couponMessage = ref('')
const couponApplied = ref(false)

function applyCoupon() {
  if (!couponCode.value.trim()) return
  couponMessage.value = 'Coupon applied!'
  couponApplied.value = true
}

const { format } = useCurrency()
const { t } = useI18n()
</script>

<template>
  <div class="summary__card">
    <h2 class="summary__title">{{ $t('cart.orderSummary') }}</h2>

    <div class="summary__coupon">
      <label class="summary__coupon-label" for="coupon-input">{{ $t('cart.couponCode') }}</label>
      <div class="summary__coupon-row">
        <input
          id="coupon-input"
          v-model="couponCode"
          type="text"
          :placeholder="t('cart.enterCodePlaceholder')"
          class="summary__coupon-input"
          autocomplete="off"
        />
        <AppButton variant="secondary" size="sm" @click="applyCoupon">{{
          $t('common.apply')
        }}</AppButton>
      </div>
      <p
        v-if="couponMessage"
        class="summary__coupon-msg"
        :class="couponApplied ? 'summary__coupon-msg--ok' : 'summary__coupon-msg--err'"
      >
        {{ couponMessage }}
      </p>
    </div>

    <dl class="summary__totals">
      <div class="summary__row">
        <dt class="summary__row-label">{{ $t('cart.subtotal') }}</dt>
        <dd class="summary__row-val">{{ format(subtotal) }}</dd>
      </div>
      <div v-if="discount > 0" class="summary__row summary__row--discount">
        <dt class="summary__row-label">{{ $t('cart.discount') }}</dt>
        <dd class="summary__row-val">-{{ format(discount) }}</dd>
      </div>
      <div class="summary__row">
        <dt class="summary__row-label">{{ $t('cart.shipping') }}</dt>
        <dd class="summary__row-val">
          {{ $t('cart.calculatedAtCheckout') }}
        </dd>
      </div>
      <div class="summary__row summary__row--total">
        <dt class="summary__row-label">{{ $t('cart.total') }}</dt>
        <dd class="summary__row-val">{{ format(total) }}</dd>
      </div>
    </dl>

    <NuxtLink to="/checkout" class="summary__checkout">
      <span class="material-symbols-outlined" aria-hidden="true">lock</span>
      {{ $t('cart.proceedToCheckout') }}
    </NuxtLink>

    <div class="summary__trust" :aria-label="t('cart.acceptedPaymentMethods')">
      <span class="summary__trust-item">
        <span class="material-symbols-outlined" aria-hidden="true">credit_card</span>
        {{ $t('cart.paymentStripe') }}
      </span>
      <span class="summary__trust-item">
        <span class="material-symbols-outlined" aria-hidden="true">account_balance</span>
        {{ $t('cart.paymentPayPal') }}
      </span>
      <span class="summary__trust-item">
        <span class="material-symbols-outlined" aria-hidden="true">payments</span>
        {{ $t('cart.paymentCod') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.summary__card {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: sticky;
  top: calc(var(--nav-height, 7rem) + 1rem);
}

.summary__title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.summary__coupon {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary__coupon-label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.summary__coupon-row {
  display: flex;
  gap: 0.5rem;
}

.summary__coupon-input {
  flex: 1;
  background: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-DEFAULT);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  transition: box-shadow var(--transition-base);
}

.summary__coupon-input:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.summary__coupon-msg {
  font-family: var(--font-label);
  font-size: 0.75rem;
  margin: 0;
}

.summary__coupon-msg--ok {
  color: var(--color-success);
}

.summary__coupon-msg--err {
  color: var(--color-error);
}

.summary__totals {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-top: 1rem;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
  margin: 0;
}

.summary__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary__row-label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.summary__row-val {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.summary__row-val--free {
  color: var(--color-success);
  font-weight: 600;
}

.summary__row--discount .summary__row-label,
.summary__row--discount .summary__row-val {
  color: var(--color-success);
}

.summary__row--total {
  padding-top: 0.625rem;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
  margin-top: 0.25rem;
}

.summary__row--total .summary__row-label,
.summary__row--total .summary__row-val {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.summary__checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.875rem;
  border-radius: var(--radius-DEFAULT);
  text-decoration: none;
  transition: box-shadow var(--transition-base);
}

.summary__checkout:hover {
  box-shadow: var(--shadow-btn-hover);
}

.summary__checkout:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.summary__checkout .material-symbols-outlined {
  font-size: 1rem;
}

.summary__trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.summary__trust-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-secondary);
}

.summary__trust-item .material-symbols-outlined {
  font-size: 0.875rem;
}
</style>
