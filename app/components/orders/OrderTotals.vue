<script setup lang="ts">
import type { Order } from '~/types/api'

defineProps<{ order: Order }>()
</script>

<template>
  <section class="order-totals">
    <h2 class="order-totals__title">Payment Summary</h2>
    <dl class="order-totals__list">
      <div class="order-totals__row">
        <dt>Subtotal</dt>
        <dd>${{ order.subtotal }}</dd>
      </div>
      <div v-if="order.discountAmount > 0" class="order-totals__row order-totals__row--positive">
        <dt>Discount</dt>
        <dd>-${{ order.discountAmount }}</dd>
      </div>
      <div class="order-totals__row">
        <dt>Shipping</dt>
        <dd :class="{ 'order-totals__val--free': order.shippingAmount === 0 }">
          {{ order.shippingAmount === 0 ? 'FREE' : `$${order.shippingAmount}` }}
        </dd>
      </div>
      <div v-if="order.taxAmount > 0" class="order-totals__row">
        <dt>Tax</dt>
        <dd>${{ order.taxAmount }}</dd>
      </div>
      <div class="order-totals__row order-totals__row--total">
        <dt>Total</dt>
        <dd>${{ order.totalAmount }}</dd>
      </div>
    </dl>
    <div class="order-totals__method">
      <span class="material-symbols-outlined" aria-hidden="true">
        {{ order.paymentMethod === 'stripe' ? 'credit_card' : 'local_shipping' }}
      </span>
      <span>
        {{ order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid by Card' }}
        —
        <span
          :class="['order-totals__pay-status', `order-totals__pay-status--${order.paymentStatus}`]"
        >
          {{ order.paymentStatus }}
        </span>
      </span>
    </div>
  </section>
</template>

<style scoped>
.order-totals__title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.order-totals__list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
}

.order-totals__row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.order-totals__row--positive dt,
.order-totals__row--positive dd {
  color: var(--color-tertiary);
}

.order-totals__row--total {
  padding-top: 0.625rem;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
  margin-top: 0.25rem;
}

.order-totals__row--total dt,
.order-totals__row--total dd {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.order-totals__val--free {
  color: var(--color-tertiary) !important;
  font-weight: 600;
}

.order-totals__method {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.875rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-secondary);
}

.order-totals__method .material-symbols-outlined {
  font-size: 1rem;
}

.order-totals__pay-status {
  font-weight: 600;
  text-transform: capitalize;
}

.order-totals__pay-status--paid {
  color: var(--color-tertiary);
}

.order-totals__pay-status--pending {
  color: var(--color-secondary);
}

.order-totals__pay-status--failed {
  color: var(--color-error);
}

.order-totals__pay-status--refunded {
  color: var(--color-primary);
}
</style>
