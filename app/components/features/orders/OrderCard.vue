<script setup lang="ts">
import type { Order, Product } from '~/types/api'

defineProps<{ order: Order }>()

const emit = defineEmits<{
  'request-return': [orderId: string]
  'cancel-order': [orderId: string]
}>()

const TRACKING_STEPS = ['Confirmed', 'Processing', 'Shipped', 'Delivered']

const STATUS_CLASSES: Record<string, string> = {
  pending: 'badge--neutral',
  confirmed: 'badge--info',
  processing: 'badge--info',
  shipped: 'badge--info',
  delivered: 'badge--success',
  cancelled: 'badge--error',
  refunded: 'badge--neutral',
}

function productName(p: Product) {
  return typeof p.name === 'string' ? p.name : (p.name?.en ?? '')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function stepComplete(orderStatus: string, step: string) {
  const order = ['confirmed', 'processing', 'shipped', 'delivered']
  return order.indexOf(orderStatus) >= TRACKING_STEPS.indexOf(step)
}
</script>

<template>
  <article class="order-card">
    <!-- Header row -->
    <div class="order-card__header">
      <div class="order-card__meta">
        <div class="order-card__meta-item">
          <span class="order-card__label">Order</span>
          <span class="order-card__value order-card__value--mono">
            #{{ order.id.slice(0, 8).toUpperCase() }}
          </span>
        </div>
        <div class="order-card__meta-item">
          <span class="order-card__label">Placed</span>
          <span class="order-card__value">{{ formatDate(order.createdAt) }}</span>
        </div>
        <div class="order-card__meta-item">
          <span class="order-card__label">Total</span>
          <span class="order-card__value order-card__value--bold"
            >${{ order.totalAmount.toFixed(2) }}</span
          >
        </div>
      </div>

      <div class="order-card__actions">
        <span class="order-card__badge" :class="STATUS_CLASSES[order.status] ?? 'badge--neutral'">
          {{ order.status }}
        </span>
        <NuxtLink :to="`/orders/${order.id}`" class="order-card__details-link">
          View details
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Items preview -->
    <div class="order-card__items">
      <div v-for="item in order.items.slice(0, 4)" :key="item.id" class="order-card__thumb">
        <img
          v-if="item.product?.images?.[0]"
          :src="item.product.images[0]"
          :alt="productName(item.product)"
          class="order-card__thumb-img"
          loading="lazy"
          decoding="async"
        />
      </div>
      <span v-if="order.items.length > 4" class="order-card__more">
        +{{ order.items.length - 4 }} more
      </span>

      <div class="order-card__item-actions">
        <button
          v-if="order.status === 'delivered'"
          type="button"
          class="order-card__btn order-card__btn--outline"
          @click="emit('request-return', order.id)"
        >
          Request Return
        </button>
        <button
          v-if="['pending', 'confirmed'].includes(order.status)"
          type="button"
          class="order-card__btn order-card__btn--danger"
          @click="emit('cancel-order', order.id)"
        >
          Cancel Order
        </button>
      </div>
    </div>

    <!-- Tracking bar -->
    <div
      v-if="!['cancelled', 'refunded'].includes(order.status)"
      class="order-card__tracking"
      role="progressbar"
      :aria-valuetext="`Order status: ${order.status}`"
    >
      <div
        v-for="(step, i) in TRACKING_STEPS"
        :key="step"
        class="order-card__step-wrap"
        :class="{ 'order-card__step-wrap--stretch': i < TRACKING_STEPS.length - 1 }"
      >
        <div class="order-card__step">
          <div
            class="order-card__step-dot"
            :class="{ 'order-card__step-dot--done': stepComplete(order.status, step) }"
          >
            <span
              class="material-symbols-outlined"
              :style="stepComplete(order.status, step) ? `font-variation-settings: 'FILL' 1` : ''"
              aria-hidden="true"
              >check</span
            >
          </div>
          <p class="order-card__step-label">{{ step }}</p>
        </div>
        <div
          v-if="i < TRACKING_STEPS.length - 1"
          class="order-card__step-line"
          :class="{
            'order-card__step-line--done': stepComplete(order.status, TRACKING_STEPS[i + 1] ?? ''),
          }"
        />
      </div>
    </div>
  </article>
</template>

<style scoped>
.order-card {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow var(--transition-slow);
}

.order-card:hover {
  box-shadow: var(--shadow-ambient);
}

/* Header */
.order-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 10%, transparent);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.order-card__meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.order-card__meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.order-card__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-secondary);
}

.order-card__value {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  font-weight: 500;
}

.order-card__value--mono {
  font-family: var(--font-headline);
  font-weight: 700;
}

.order-card__value--bold {
  font-weight: 700;
}

.order-card__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Status badge */
.order-card__badge {
  padding: 0.1875rem 0.625rem;
  border-radius: var(--radius-full);
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.badge--neutral {
  background: var(--color-surface-container);
  color: var(--color-secondary);
}

.badge--info {
  background: var(--color-secondary-container);
  color: var(--color-on-surface);
}

.badge--success {
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
  color: var(--color-success);
}

.badge--error {
  background: var(--color-error-container);
  color: var(--color-on-error-container);
}

.order-card__details-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap var(--transition-fast);
}

.order-card__details-link:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
  gap: 0.375rem;
}

.order-card__details-link .material-symbols-outlined {
  font-size: 0.875rem;
}

/* Items */
.order-card__items {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  flex-wrap: wrap;
}

.order-card__thumb {
  width: 3.5rem;
  height: 3.5rem;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-DEFAULT);
  overflow: hidden;
  flex-shrink: 0;
}

.order-card__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-card__more {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.order-card__item-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.order-card__btn {
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-DEFAULT);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.order-card__btn--outline {
  background: none;
  border: 1px solid color-mix(in srgb, var(--color-outline-variant) 30%, transparent);
  color: var(--color-on-surface);
}

.order-card__btn--outline:hover {
  background: var(--color-surface-container-low);
}

.order-card__btn--danger {
  background: none;
  color: var(--color-error);
}

.order-card__btn--danger:hover {
  text-decoration: underline;
}

/* Tracking */
.order-card__tracking {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem 1rem;
}

.order-card__step-wrap {
  display: flex;
  align-items: center;
}

.order-card__step-wrap--stretch {
  flex: 1;
}

.order-card__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.order-card__step-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-container);
  color: var(--color-secondary);
  transition:
    background var(--transition-base),
    color var(--transition-base);
}

.order-card__step-dot--done {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.order-card__step-dot .material-symbols-outlined {
  font-size: 0.75rem;
}

.order-card__step-label {
  font-family: var(--font-label);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-secondary);
  white-space: nowrap;
  margin: 0;
}

.order-card__step-line {
  flex: 1;
  height: 2px;
  background: var(--color-surface-container);
  margin-inline: 0.25rem;
  align-self: flex-start;
  margin-top: 0.75rem;
  transition: background var(--transition-base);
}

.order-card__step-line--done {
  background: var(--color-primary-container);
}
</style>
