<script setup lang="ts">
import type { Order } from '~/types/api'
// import { useStatusColors } from '~/composables/admin/useStatusColors'

interface Props {
  orders: Order[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

// const { getStatusClass } = useStatusColors()

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getOrderId(orderId: string): string {
  return `#${orderId.slice(0, 8).toUpperCase()}`
}
</script>

<template>
  <div class="lg:col-span-2 bg-surface-container-lowest rounded shadow-sm">
    <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
      <h3 class="font-bold text-on-surface font-headline">Recent Orders</h3>
      <NuxtLink
        to="/admin/orders"
        class="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
      >
        View all <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </NuxtLink>
    </div>

    <DataTableSkeleton v-if="loading" :rows="5" :columns="4" />

    <div v-else class="divide-y divide-outline-variant/10">
      <div
        v-for="order in orders"
        :key="order.id"
        class="px-6 py-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors"
      >
        <div class="flex-1">
          <p class="text-sm font-bold text-on-surface">
            {{ getOrderId(order.id) }}
          </p>
          <p class="text-xs text-secondary">{{ order.user?.email ?? 'Customer' }}</p>
        </div>
        <div class="text-right hidden sm:block">
          <p class="text-sm font-semibold text-on-surface">${{ order.totalAmount }}</p>
          <p class="text-xs text-secondary">{{ formatDate(order.createdAt) }}</p>
        </div>
        <AdminSharedStatusBadge :status="order.status" size="sm" />
      </div>
      <div v-if="!orders.length" class="px-6 py-8 text-center text-secondary text-sm">
        No recent orders
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Recent orders styles */
</style>
