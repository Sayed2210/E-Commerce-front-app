<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold font-headline text-on-surface">Orders</h2>
        <p class="text-secondary text-sm">{{ total }} total orders</p>
      </div>
      <div class="flex gap-3">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">search</span>
          <input
            v-model="search"
            type="text"
            placeholder="Search by ID or customer…"
            class="bg-surface-container-lowest border border-outline-variant/20 rounded pl-9 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <select
          v-model="statusFilter"
          class="bg-surface-container-lowest border border-outline-variant/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-on-surface"
        >
          <option value="">All Statuses</option>
          <option v-for="s in statuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
        </select>
        <button class="bg-primary-container text-on-primary-container px-4 py-2 text-xs font-bold rounded flex items-center gap-2 hover:brightness-95 transition-all">
          <span class="material-symbols-outlined text-sm">download</span>
          Export
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container-low">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary">Order ID</th>
            <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary hidden md:table-cell">Customer</th>
            <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary hidden lg:table-cell">Date</th>
            <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary hidden lg:table-cell">Payment</th>
            <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary">Total</th>
            <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary">Status</th>
            <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary">Actions</th>
          </tr>
        </thead>

        <tbody v-if="pending">
          <tr v-for="i in 8" :key="i" class="border-t border-outline-variant/10 animate-pulse">
            <td v-for="j in 7" :key="j" class="px-6 py-4">
              <div class="h-4 bg-surface-container-low rounded w-full"></div>
            </td>
          </tr>
        </tbody>

        <tbody v-else class="divide-y divide-outline-variant/10">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-surface-container-low transition-colors"
          >
            <td class="px-6 py-4">
              <span class="font-bold text-sm text-on-surface font-headline">#{{ order.id.slice(0, 8).toUpperCase() }}</span>
            </td>
            <td class="px-6 py-4 hidden md:table-cell">
              <div>
                <p class="text-sm text-on-surface font-semibold">{{ order.user?.firstName ?? '' }} {{ order.user?.lastName ?? '' }}</p>
                <p class="text-xs text-secondary">{{ order.user?.email ?? '—' }}</p>
              </div>
            </td>
            <td class="px-6 py-4 hidden lg:table-cell text-sm text-secondary">{{ formatDate(order.createdAt) }}</td>
            <td class="px-6 py-4 hidden lg:table-cell">
              <span class="micro-chip bg-surface-container text-secondary capitalize">{{ order.paymentMethod }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm font-bold text-on-surface">${{ order.total.toFixed(2) }}</span>
            </td>
            <td class="px-6 py-4">
              <select
                :value="order.status"
                @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                :class="statusClass(order.status)"
                class="text-xs font-bold uppercase rounded-full px-3 py-1 border-none outline-none cursor-pointer"
              >
                <option v-for="s in statuses" :key="s" :value="s" class="capitalize">{{ s }}</option>
              </select>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <NuxtLink :to="`/admin/orders/${order.id}`" class="text-primary hover:underline text-xs font-semibold">
                  View
                </NuxtLink>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredOrders.length">
            <td colspan="7" class="px-6 py-12 text-center text-secondary text-sm">No orders found</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10">
        <p class="text-xs text-secondary">Page {{ currentPage }} of {{ totalPages }}</p>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low transition-colors">Prev</button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low transition-colors">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listOrders, updateOrderStatus } = useOrders()

const search       = ref('')
const statusFilter = ref('')
const currentPage  = ref(1)

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

const { data, pending, refresh } = await listOrders({ page: currentPage.value, limit: 20 })
watch(currentPage, () => refresh())

const orders = computed<Order[]>(() => (data.value as any)?.data ?? (data.value as any) ?? [])
const total  = computed<number>(() => (data.value as any)?.total ?? orders.value.length)
const totalPages = computed<number>(() => (data.value as any)?.totalPages ?? 1)

const filteredOrders = computed(() =>
  orders.value.filter(o => {
    const matchSearch = !search.value ||
      o.id.includes(search.value) ||
      o.user?.email?.includes(search.value)
    const matchStatus = !statusFilter.value || o.status === statusFilter.value
    return matchSearch && matchStatus
  })
)

async function updateStatus(id: string, status: string) {
  await updateOrderStatus(id, status)
  await refresh()
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending:    'bg-surface-container text-secondary',
    confirmed:  'bg-secondary-container text-on-surface',
    processing: 'bg-orange-100 text-orange-800',
    shipped:    'bg-blue-100 text-blue-800',
    delivered:  'bg-emerald-100 text-emerald-800',
    cancelled:  'bg-error-container text-on-error-container',
    refunded:   'bg-surface-container text-secondary',
  }
  return map[status] ?? 'bg-surface-container text-secondary'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

useSeoMeta({ title: 'Orders — Admin' })
</script>
