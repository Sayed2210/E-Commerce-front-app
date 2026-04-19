<script setup lang="ts">
import type { WishlistItem } from '~/types/api'

definePageMeta({ layout: 'default', middleware: 'auth' })
useSeoMeta({ title: 'My Wishlist — ArchitectMarket', robots: 'noindex, nofollow' })

const { getWishlist, removeFromWishlist, clearWishlist } = useWishlist()
const { addItem } = useCart()

const { data, pending, refresh } = await getWishlist()
const items = computed<WishlistItem[]>(() => (data.value as any) ?? [])

async function removeItem(productId: string) {
  await removeFromWishlist(productId)
  await refresh()
}

async function clearAll() {
  await clearWishlist()
  await refresh()
}

async function moveToCart(productId: string) {
  const item = items.value.find((i) => i.productId === productId || i.product?.id === productId)
  await addItem({ productId: item?.product?.id ?? productId, quantity: 1 })
  await removeFromWishlist(productId)
  await refresh()
}

useSeoMeta({ title: 'My Wishlist — ArchitectMarket' })
</script>

<template>
  <div class="wishlist-page">
    <!-- Header -->
    <div class="wishlist-page__header">
      <div>
        <h1 class="wishlist-page__title">My Wishlist</h1>
        <p class="wishlist-page__count">
          {{ items.length }} saved item{{ items.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <button v-if="items.length" type="button" class="wishlist-page__clear" @click="clearAll">
        <span class="material-symbols-outlined" aria-hidden="true">delete_sweep</span>
        Clear all
      </button>
    </div>

    <!-- Loading — reuse ProductSkeleton -->
    <ul
      v-if="pending"
      class="wishlist-page__grid"
      role="list"
      aria-label="Loading wishlist"
      aria-busy="true"
    >
      <li v-for="i in 8" :key="i">
        <ProductSkeleton variant="grid" />
      </li>
    </ul>

    <!-- Wishlist grid — ProductCard handles image, stars, price, add-to-cart -->
    <ul
      v-else-if="items.length"
      class="wishlist-page__grid"
      role="list"
      :aria-label="`${items.length} saved products`"
    >
      <li v-for="item in items" :key="item.id">
        <ProductCard
          v-if="item.product"
          :product="item.product"
          variant="grid"
          :wishlist="true"
          @add-to-cart="moveToCart"
          @toggle-wish="removeItem"
        />
      </li>
    </ul>

    <!-- Empty state -->
    <div v-else class="wishlist-page__empty" role="status">
      <span
        class="material-symbols-outlined wishlist-page__empty-icon"
        aria-hidden="true"
        style="font-variation-settings: 'FILL' 0"
        >favorite_border</span
      >
      <h2 class="wishlist-page__empty-title">Your wishlist is empty</h2>
      <p class="wishlist-page__empty-body">Save items you love to buy them later.</p>
      <NuxtLink to="/products" class="wishlist-page__empty-cta">Explore Products</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.wishlist-page {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 2rem var(--container-pad) 4rem;
}

.wishlist-page__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.wishlist-page__title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.wishlist-page__count {
  font-family: var(--font-label);
  font-size: 0.8125rem;
  color: var(--color-secondary);
  margin: 0.25rem 0 0;
}

.wishlist-page__clear {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-secondary);
  transition: color var(--transition-fast);
}

.wishlist-page__clear:hover {
  color: var(--color-error);
}

.wishlist-page__clear:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.wishlist-page__clear .material-symbols-outlined {
  font-size: 0.875rem;
}

.wishlist-page__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (width >= 480px) {
  .wishlist-page__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 768px) {
  .wishlist-page__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 1280px) {
  .wishlist-page__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Empty state */
.wishlist-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 1rem;
  text-align: center;
  gap: 0.875rem;
}

.wishlist-page__empty-icon {
  font-size: 4.5rem;
  color: var(--color-secondary);
  opacity: 0.2;
}

.wishlist-page__empty-title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.wishlist-page__empty-body {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-secondary);
  margin: 0;
}

.wishlist-page__empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.625rem 1.75rem;
  border-radius: var(--radius-DEFAULT);
  text-decoration: none;
  margin-top: 0.5rem;
  transition: box-shadow var(--transition-base);
}

.wishlist-page__empty-cta:hover {
  box-shadow: var(--shadow-btn-hover);
}

.wishlist-page__empty-cta:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}
</style>
