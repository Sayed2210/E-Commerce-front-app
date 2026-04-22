<script setup lang="ts">
import type { Order } from '~/types/api'

defineProps<{ order: Order }>()

const STATUS_COLOR: Record<string, string> = {
  pending: 'order-header__badge--pending',
  confirmed: 'order-header__badge--confirmed',
  processing: 'order-header__badge--processing',
  shipped: 'order-header__badge--shipped',
  delivered: 'order-header__badge--delivered',
  cancelled: 'order-header__badge--cancelled',
  refunded: 'order-header__badge--refunded',
}
</script>

<template>
  <div class="order-header">
    <div class="order-header__meta">
      <h1 class="order-header__id">
        {{ order.orderNumber ?? `#${order.id.slice(-8).toUpperCase()}` }}
      </h1>
      <time class="order-header__date" :datetime="order.createdAt">
        {{
          new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }}
      </time>
    </div>
    <span class="order-header__badge" :class="STATUS_COLOR[order.status]">
      {{ order.status }}
    </span>
  </div>
</template>

<style scoped>
.order-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.order-header__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-header__id {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.order-header__date {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.order-header__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.order-header__badge--pending {
  background: color-mix(in srgb, var(--color-secondary) 12%, transparent);
  color: var(--color-secondary);
}

.order-header__badge--confirmed {
  background: color-mix(in srgb, var(--color-tertiary) 12%, transparent);
  color: var(--color-tertiary);
}

.order-header__badge--processing {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.order-header__badge--shipped {
  background: color-mix(in srgb, var(--color-tertiary) 18%, transparent);
  color: var(--color-tertiary);
}

.order-header__badge--delivered {
  background: color-mix(in srgb, var(--color-success, #2d6a4f) 12%, transparent);
  color: var(--color-success, #2d6a4f);
}

.order-header__badge--cancelled {
  background: var(--color-error-container);
  color: var(--color-on-error-container);
}

.order-header__badge--refunded {
  background: var(--color-error-container);
  color: var(--color-on-error-container);
}
</style>
