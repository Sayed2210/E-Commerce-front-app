<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })
useSeoMeta({ title: 'Shopping Cart — ArchitectMarket' })

const cartStore = useCartStore()
const { fetchCart, updateItem, removeItem } = useCart()

const loading = ref(true)

const items = computed(() => cartStore.items)
const isEmpty = computed(() => cartStore.isEmpty)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const discount = computed(() => cartStore.discount)
const cartTotal = computed(() => {
  const shipping = subtotal.value >= 99 ? 0 : 9.99
  return Math.max(0, subtotal.value - discount.value + shipping)
})

onMounted(async () => {
  await fetchCart()
  loading.value = false
})

async function handleChangeQty(id: string, qty: number) {
  if (qty < 1) return handleRemove(id)
  await updateItem(id, { quantity: qty })
}

async function handleRemove(id: string) {
  await removeItem(id)
}

function handleSaveForLater(_id: string) {
  // TODO: move to wishlist
}

const breadcrumbs = [{ label: 'Marketplace', to: '/' }, { label: 'Shopping Cart' }]
</script>

<template>
  <div class="cart-page">
    <AppBreadcrumb :items="breadcrumbs" />

    <AppEmptyState
      v-if="isEmpty && !loading"
      icon="shopping_cart"
      title="Your cart is empty"
      body="Looks like you haven't added anything yet."
    >
      <template #cta>
        <NuxtLink to="/products" class="cart-page__empty-cta">Start Shopping</NuxtLink>
      </template>
    </AppEmptyState>

    <div v-else class="cart-page__layout">
      <section class="cart-section" aria-label="Cart items">
        <div class="cart-section__header">
          <h1 class="cart-section__title">Shopping Cart</h1>
          <span class="cart-section__count"
            >{{ itemCount }} item{{ itemCount !== 1 ? 's' : '' }}</span
          >
        </div>

        <ul
          v-if="loading"
          class="cart-section__list"
          role="list"
          aria-busy="true"
          aria-label="Loading cart"
        >
          <li v-for="i in 3" :key="i"><ProductSkeleton variant="list" /></li>
        </ul>

        <ul v-else class="cart-section__list" role="list" :aria-label="`${itemCount} cart items`">
          <CartItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            @change-qty="handleChangeQty"
            @remove="handleRemove"
            @save-for-later="handleSaveForLater"
          />
        </ul>

        <NuxtLink to="/products" class="cart-section__continue">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Continue Shopping
        </NuxtLink>
      </section>

      <aside class="cart-sidebar" aria-label="Order summary">
        <CartOrderSummary :subtotal="subtotal" :discount="discount" :total="cartTotal" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 1.5rem var(--container-pad) 4rem;
}

.cart-page__empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-DEFAULT);
  text-decoration: none;
  transition: box-shadow var(--transition-base);
}

.cart-page__empty-cta:hover {
  box-shadow: var(--shadow-btn-hover);
}

.cart-page__empty-cta:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.cart-page__layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (width >= 1024px) {
  .cart-page__layout {
    flex-direction: row;
    align-items: flex-start;
  }
}

.cart-section {
  flex: 1;
  min-width: 0;
}

.cart-section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.cart-section__title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.cart-section__count {
  font-family: var(--font-label);
  font-size: 0.8125rem;
  color: var(--color-secondary);
}

.cart-section__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.cart-section__continue {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1.5rem;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap var(--transition-fast);
}

.cart-section__continue:hover {
  gap: 0.625rem;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.cart-section__continue .material-symbols-outlined {
  font-size: 0.875rem;
}

.cart-sidebar {
  width: 100%;
}

@media (width >= 1024px) {
  .cart-sidebar {
    width: 22rem;
    flex-shrink: 0;
  }
}
</style>
