<script setup lang="ts">
import type { OrderItem } from '~/types/api'

defineProps<{ items: OrderItem[]; canReturn?: boolean }>()
const emit = defineEmits<{ requestReturn: [itemId: string] }>()

function productName(item: OrderItem) {
  const n = item.product?.name
  return typeof n === 'string' ? n : (n?.en ?? '')
}

function variantLabel(item: OrderItem) {
  if (!item.variant) return null
  const n = item.variant.variantName
  return typeof n === 'string' ? n : (n?.en ?? null)
}
</script>

<template>
  <section class="line-items">
    <h2 class="line-items__title">Items</h2>
    <ul class="line-items__list" role="list">
      <li v-for="item in items" :key="item.id" class="line-items__row">
        <div class="line-items__img-wrap">
          <img
            v-if="item.product?.images?.[0]"
            :src="item.product.images[0]"
            :alt="productName(item)"
            class="line-items__img"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="line-items__info">
          <p class="line-items__name">{{ productName(item) }}</p>
          <p v-if="variantLabel(item)" class="line-items__variant">{{ variantLabel(item) }}</p>
          <p class="line-items__qty">Qty: {{ item.quantity }}</p>
        </div>
        <div class="line-items__right">
          <p class="line-items__price">${{ item.totalPrice.toFixed(2) }}</p>
          <button
            v-if="canReturn"
            type="button"
            class="line-items__return"
            @click="emit('requestReturn', item.id)"
          >
            Return
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.line-items__title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.line-items__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.line-items__row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1rem;
}

.line-items__img-wrap {
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-DEFAULT);
  overflow: hidden;
}

.line-items__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.line-items__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.line-items__name {
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-on-surface);
  margin: 0;
}

.line-items__variant,
.line-items__qty {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-secondary);
  margin: 0;
}

.line-items__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

.line-items__price {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.line-items__return {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 0;
}

.line-items__return:hover {
  opacity: 0.75;
}
</style>
