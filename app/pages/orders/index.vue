<script setup lang="ts">
import type { Order } from '~/types/api'

definePageMeta({ layout: 'default', middleware: 'auth' })
useSeoMeta({ title: 'My Orders — ArchitectMarket' })

const { listOrders } = useOrders()

const activeTab = ref('all')

const STATUS_TABS = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
]

const { data, pending } = await listOrders({ limit: 20 })
const orders = computed<Order[]>(() => {
  const response = data.value as { data?: Order[] } | Order[] | null
  return (response && 'data' in response ? response.data : response) ?? []
})

const filteredOrders = computed(() =>
  activeTab.value === 'all'
    ? orders.value
    : orders.value.filter((o) => o.status === activeTab.value)
)

function openReturnDialog(orderId: string) {
  router.push(`/orders/${orderId}`)
}

const router = useRouter()
</script>

<template>
  <div class="orders-page">
    <div class="orders-page__header">
      <h1 class="orders-page__title">My Orders</h1>
      <p class="orders-page__subtitle">Track and manage your purchases</p>
    </div>

    <AppTabBar
      v-model="activeTab"
      :tabs="STATUS_TABS"
      aria-label="Filter orders by status"
      class="orders-page__tabs"
    />

    <div v-if="pending" class="orders-page__list">
      <div v-for="i in 4" :key="i" class="orders-page__skeleton" aria-hidden="true">
        <div class="orders-page__skeleton-line orders-page__skeleton-line--short" />
        <div class="orders-page__skeleton-line orders-page__skeleton-line--medium" />
        <div class="orders-page__skeleton-line orders-page__skeleton-line--short" />
      </div>
    </div>

    <ul
      v-else-if="filteredOrders.length"
      class="orders-page__list"
      role="list"
      :aria-label="`${filteredOrders.length} orders`"
    >
      <li v-for="order in filteredOrders" :key="order.id">
        <OrderCard :order="order" @request-return="openReturnDialog" @cancel-order="() => {}" />
      </li>
    </ul>

    <AppEmptyState
      v-else
      icon="shopping_bag"
      title="No orders yet"
      body="When you place an order, it will appear here."
    >
      <template #cta>
        <NuxtLink to="/products" class="orders-page__cta">Start Shopping</NuxtLink>
      </template>
    </AppEmptyState>
  </div>
</template>

<style scoped>
.orders-page {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 2rem var(--container-pad) 4rem;
}

.orders-page__header {
  margin-bottom: 2rem;
}

.orders-page__title {
  font-family: var(--font-headline);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.orders-page__subtitle {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
  margin: 0.25rem 0 0;
}

.orders-page__tabs {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.orders-page__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.orders-page__skeleton {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.orders-page__skeleton-line {
  background: var(--color-surface-container-low);
  border-radius: var(--radius-sm);
  height: 0.875rem;
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

.orders-page__skeleton-line--short {
  width: 25%;
}

.orders-page__skeleton-line--medium {
  width: 50%;
}

@keyframes skeleton-shimmer {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

.orders-page__cta {
  display: inline-flex;
  align-items: center;
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

.orders-page__cta:hover {
  box-shadow: var(--shadow-btn-hover);
}

.orders-page__cta:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}
</style>
