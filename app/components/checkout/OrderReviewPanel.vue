<script setup lang="ts">
import type { CartItem } from '~/types/api'

const props = defineProps<{
  items: CartItem[]
  subtotal: number
  discount: number
  couponDiscount: number
  shippingFee: number
  loading: boolean
  emailNotVerified?: boolean
}>()

const emit = defineEmits<{ 'place-order': [] }>()

const total = computed(() =>
  Math.max(0, props.subtotal - props.discount - props.couponDiscount + props.shippingFee)
)

function productName(item: CartItem) {
  const n = item.product?.name
  return typeof n === 'string' ? n : (n?.en ?? '')
}
</script>

<template>
  <aside class="review-panel">
    <h2 class="review-panel__title">Order Summary</h2>

    <ul class="review-panel__items" role="list">
      <li v-for="item in items" :key="item.id" class="review-panel__item">
        <span class="review-panel__item-name">{{ productName(item) }}</span>
        <span class="review-panel__item-qty">× {{ item.quantity }}</span>
        <span class="review-panel__item-price">${{ item.totalPrice.toFixed(2) }}</span>
      </li>
    </ul>

    <dl class="review-panel__totals">
      <div class="review-panel__row">
        <dt>Subtotal</dt>
        <dd>${{ subtotal.toFixed(2) }}</dd>
      </div>
      <div v-if="discount > 0" class="review-panel__row review-panel__row--positive">
        <dt>Cart Discount</dt>
        <dd>-${{ discount.toFixed(2) }}</dd>
      </div>
      <div v-if="couponDiscount > 0" class="review-panel__row review-panel__row--positive">
        <dt>Coupon</dt>
        <dd>-${{ couponDiscount.toFixed(2) }}</dd>
      </div>
      <div class="review-panel__row">
        <dt>Shipping</dt>
        <dd :class="{ 'review-panel__val--free': shippingFee === 0 }">
          {{ shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}` }}
        </dd>
      </div>
      <div class="review-panel__row review-panel__row--total">
        <dt>Total</dt>
        <dd>${{ total.toFixed(2) }}</dd>
      </div>
    </dl>

    <div v-if="emailNotVerified" class="review-panel__warning" role="alert">
      <span class="material-symbols-outlined" aria-hidden="true">mail</span>
      <span>Please verify your email before placing an order. Check your inbox.</span>
    </div>

    <button
      type="button"
      class="review-panel__cta"
      :disabled="loading"
      @click="emit('place-order')"
    >
      <span class="material-symbols-outlined" aria-hidden="true">lock</span>
      {{ loading ? 'Placing Order…' : 'Place Order' }}
    </button>
  </aside>
</template>

<style scoped>
.review-panel {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: sticky;
  top: calc(var(--nav-height, 7rem) + 1rem);
}

.review-panel__title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.review-panel__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.review-panel__item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
}

.review-panel__item-name {
  flex: 1;
  color: var(--color-on-surface);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-panel__item-qty {
  color: var(--color-secondary);
  white-space: nowrap;
}

.review-panel__item-price {
  color: var(--color-on-surface);
  font-weight: 600;
  white-space: nowrap;
}

.review-panel__totals {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-top: 0.75rem;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
  margin: 0;
}

.review-panel__row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.review-panel__row--positive dt,
.review-panel__row--positive dd {
  color: var(--color-tertiary);
}

.review-panel__row--total {
  padding-top: 0.625rem;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
  margin-top: 0.25rem;
}

.review-panel__row--total dt,
.review-panel__row--total dd {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.review-panel__val--free {
  color: var(--color-tertiary) !important;
  font-weight: 600;
}

.review-panel__warning {
  display: flex;
  gap: 0.625rem;
  align-items: flex-start;
  background: color-mix(in srgb, var(--color-primary-container) 40%, transparent);
  border-radius: var(--radius-DEFAULT);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-on-primary-container);
}

.review-panel__warning .material-symbols-outlined {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.review-panel__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-DEFAULT);
  padding: 0.875rem;
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow var(--transition-base), opacity var(--transition-fast);
}

.review-panel__cta:hover:not(:disabled) {
  box-shadow: var(--shadow-btn-hover);
}

.review-panel__cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.review-panel__cta .material-symbols-outlined {
  font-size: 1rem;
}
</style>
