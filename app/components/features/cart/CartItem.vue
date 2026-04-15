<script setup lang="ts">
import type { CartItem, Product, ProductVariant } from '~/types/api'

defineProps<{ item: CartItem }>()

const emit = defineEmits<{
  'change-qty': [id: string, qty: number]
  remove: [id: string]
  'save-for-later': [id: string]
}>()

function productName(p: Product | undefined) {
  if (!p) return ''
  return typeof p.name === 'string' ? p.name : (p.name?.en ?? '')
}

function variantName(v: ProductVariant) {
  const n = v.variantName
  return typeof n === 'string' ? n : (n?.en ?? '')
}
</script>

<template>
  <li class="cart-item">
    <div class="cart-item__img-wrap">
      <img
        v-if="item.product?.images?.[0]"
        :src="item.product.images[0]"
        :alt="productName(item.product)"
        class="cart-item__img"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="cart-item__body">
      <div class="cart-item__top">
        <div>
          <h3 class="cart-item__name">{{ productName(item.product) }}</h3>
          <p v-if="item.variant" class="cart-item__variant">
            Variant: {{ variantName(item.variant) }}
          </p>
        </div>
        <p class="cart-item__price">${{ item.totalPrice.toFixed(2) }}</p>
      </div>

      <div class="cart-item__stock">
        <span
          class="cart-item__badge"
          :class="
            item.product?.inventoryQuantity > 0 ? 'cart-item__badge--in' : 'cart-item__badge--out'
          "
        >
          {{ item.product?.inventoryQuantity > 0 ? 'In Stock' : 'Out of Stock' }}
        </span>
      </div>

      <div class="cart-item__foot">
        <div class="cart-item__qty">
          <span class="cart-item__qty-label">Qty:</span>
          <div
            class="cart-item__stepper"
            role="group"
            :aria-label="`Quantity for ${productName(item.product)}`"
          >
            <button
              type="button"
              class="cart-item__stepper-btn"
              aria-label="Decrease quantity"
              @click="emit('change-qty', item.id, item.quantity - 1)"
            >
              <span class="material-symbols-outlined" aria-hidden="true">remove</span>
            </button>
            <span class="cart-item__stepper-val">{{ item.quantity }}</span>
            <button
              type="button"
              class="cart-item__stepper-btn"
              aria-label="Increase quantity"
              @click="emit('change-qty', item.id, item.quantity + 1)"
            >
              <span class="material-symbols-outlined" aria-hidden="true">add</span>
            </button>
          </div>
        </div>

        <div class="cart-item__divider" aria-hidden="true" />

        <div class="cart-item__actions">
          <button
            type="button"
            class="cart-item__action cart-item__action--remove"
            @click="emit('remove', item.id)"
          >
            Remove
          </button>
          <button
            type="button"
            class="cart-item__action cart-item__action--save"
            @click="emit('save-for-later', item.id)"
          >
            Save for later
          </button>
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped>
.cart-item {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  gap: 1.25rem;
  transition: box-shadow var(--transition-slow);
  list-style: none;
}

.cart-item:hover {
  box-shadow: var(--shadow-ambient);
}

.cart-item__img-wrap {
  width: 7rem;
  height: 7rem;
  flex-shrink: 0;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-DEFAULT);
  overflow: hidden;
}

.cart-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.cart-item__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.cart-item__name {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-on-surface);
  margin: 0;
  line-height: 1.35;
}

.cart-item__variant {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-secondary);
  margin: 0.25rem 0 0;
}

.cart-item__price {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
  white-space: nowrap;
}

.cart-item__stock {
  display: flex;
}

.cart-item__badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-family: var(--font-label);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.cart-item__badge--in {
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  color: var(--color-success);
}

.cart-item__badge--out {
  background: var(--color-error-container);
  color: var(--color-on-error-container);
}

.cart-item__foot {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cart-item__qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-item__qty-label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-secondary);
}

.cart-item__stepper {
  display: flex;
  align-items: center;
  border: 1px solid color-mix(in srgb, var(--color-outline-variant) 20%, transparent);
  border-radius: var(--radius-DEFAULT);
}

.cart-item__stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  transition: color var(--transition-fast);
}

.cart-item__stepper-btn:hover {
  color: var(--color-primary);
}

.cart-item__stepper-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -1px;
}

.cart-item__stepper-btn .material-symbols-outlined {
  font-size: 0.875rem;
}

.cart-item__stepper-val {
  padding-inline: 0.75rem;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-on-surface);
  min-width: 2rem;
  text-align: center;
}

.cart-item__divider {
  width: 1px;
  height: 1rem;
  background: color-mix(in srgb, var(--color-outline-variant) 30%, transparent);
}

.cart-item__actions {
  display: flex;
  gap: 1rem;
}

.cart-item__action {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity var(--transition-fast);
}

.cart-item__action--remove {
  color: var(--color-error);
}

.cart-item__action--save {
  color: var(--color-primary);
}

.cart-item__action:hover {
  opacity: 0.75;
}

.cart-item__action:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
</style>
