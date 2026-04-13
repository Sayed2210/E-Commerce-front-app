<template>
  <div class="space-y-8">
    <!-- Title row -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold font-headline tracking-tight text-on-surface">Dashboard Overview</h2>
        <p class="text-secondary text-sm">Real-time performance metrics for ArchitectMarket</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <UIcon
                name="i-heroicons-cube"
                class="h-6 w-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Products
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                1,234
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <UIcon
                name="i-heroicons-shopping-bag"
                class="h-6 w-6 text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                856
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <UIcon
                name="i-heroicons-users"
                class="h-6 w-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                3,421
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <UIcon
                name="i-heroicons-currency-dollar"
                class="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                $45,231
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Recent Orders -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <UButton to="/admin/orders" variant="ghost" color="primary">
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-center text-gray-600 dark:text-gray-400 py-8">
            No recent orders to display
          </p>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <div class="grid gap-6 md:grid-cols-3">
        <UButton
          to="/admin/products"
          color="primary"
          size="lg"
          icon="i-heroicons-plus"
          block
        >
          Add Product
        </UButton>

        <UButton
          to="/admin/categories"
          color="secondary"
          size="lg"
          icon="i-heroicons-tag"
          block
        >
          Manage Categories
        </UButton>

        <UButton
          to="/admin/users"
          color="success"
          size="lg"
          icon="i-heroicons-users"
          block
        >
          View Users
        </UButton>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="bg-surface-container-lowest p-6 rounded shadow-sm hover:shadow-ambient transition-all border-b-2 border-transparent hover:border-primary-container"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 rounded-sm" :class="kpi.iconBg">
            <span class="material-symbols-outlined" :class="kpi.iconColor">{{ kpi.icon }}</span>
          </div>
          <div v-if="kpi.trend" class="flex items-center text-xs font-bold" :class="kpi.trend > 0 ? 'text-green-600' : 'text-error'">
            <span class="material-symbols-outlined text-sm">{{ kpi.trend > 0 ? 'trending_up' : 'trending_down' }}</span>
            {{ Math.abs(kpi.trend) }}%
          </div>
        </div>
        <p class="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">{{ kpi.label }}</p>
        <p class="text-2xl font-bold font-headline text-on-surface">
          {{ pending ? '—' : kpi.value }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <div class="lg:col-span-2 bg-surface-container-lowest rounded shadow-sm">
        <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h3 class="font-bold text-on-surface font-headline">Recent Orders</h3>
          <NuxtLink to="/admin/orders" class="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
            View all <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>

        <div v-if="pending" class="divide-y divide-outline-variant/10">
          <div v-for="i in 5" :key="i" class="px-6 py-4 flex items-center gap-4 animate-pulse">
            <div class="h-4 bg-surface-container-low rounded w-1/4"></div>
            <div class="h-4 bg-surface-container-low rounded w-1/3"></div>
            <div class="h-4 bg-surface-container-low rounded w-1/5 ml-auto"></div>
          </div>
        </div>

        <div v-else class="divide-y divide-outline-variant/10">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="px-6 py-4 flex items-center gap-4 hover:bg-surface-container-low transition-colors"
          >
            <div class="flex-1">
              <p class="text-sm font-bold text-on-surface">#{{ order.id.slice(0, 8).toUpperCase() }}</p>
              <p class="text-xs text-secondary">{{ order.user?.email ?? 'Customer' }}</p>
            </div>
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold text-on-surface">${{ order.total.toFixed(2) }}</p>
              <p class="text-xs text-secondary">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span
              :class="statusClass(order.status)"
              class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
            >{{ order.status }}</span>
          </div>
          <div v-if="!recentOrders.length" class="px-6 py-8 text-center text-secondary text-sm">
            No recent orders
          </div>
        </div>
      </div>

      <!-- Top products + status breakdown -->
      <div class="space-y-4">
        <!-- Order status breakdown -->
        <div class="bg-surface-container-lowest rounded shadow-sm p-6">
          <h3 class="font-bold text-on-surface font-headline mb-4">Order Status</h3>
          <div class="space-y-3">
            <div v-for="s in orderStatuses" :key="s.status" class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full shrink-0" :class="s.color"></div>
              <span class="text-xs text-secondary flex-1 capitalize">{{ s.status }}</span>
              <span class="text-xs font-bold text-on-surface">{{ pending ? '—' : s.count }}</span>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="bg-surface-container-lowest rounded shadow-sm p-6">
          <h3 class="font-bold text-on-surface font-headline mb-4">Quick Actions</h3>
          <div class="space-y-2">
            <NuxtLink to="/admin/products/create" class="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors py-1">
              <span class="material-symbols-outlined text-xl text-primary-container">add_box</span>
              Add New Product
            </NuxtLink>
            <NuxtLink to="/admin/orders" class="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors py-1">
              <span class="material-symbols-outlined text-xl text-primary-container">assignment</span>
              Manage Orders
            </NuxtLink>
            <NuxtLink to="/admin/users" class="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors py-1">
              <span class="material-symbols-outlined text-xl text-primary-container">group</span>
              View Customers
            </NuxtLink>
            <NuxtLink to="/admin/coupons" class="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors py-1">
              <span class="material-symbols-outlined text-xl text-primary-container">local_offer</span>
              Create Coupon
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { getDashboardStats } = useAdmin()
const { data, pending } = await getDashboardStats()
const stats = computed(() => (data.value as any) ?? null)

const kpis = computed(() => [
  {
    label:   'Total Revenue',
    value:   stats.value ? `$${Number(stats.value.totalRevenue ?? 0).toLocaleString()}` : '—',
    icon:    'payments',
    iconBg:  'bg-orange-50',
    iconColor: 'text-orange-600',
    trend:   12.5
  },
  {
    label:   'Total Orders',
    value:   stats.value ? Number(stats.value.totalOrders ?? 0).toLocaleString() : '—',
    icon:    'shopping_cart',
    iconBg:  'bg-blue-50',
    iconColor: 'text-blue-600',
    trend:   8.1
  },
  {
    label:   'Customers',
    value:   stats.value ? Number(stats.value.totalUsers ?? 0).toLocaleString() : '—',
    icon:    'group',
    iconBg:  'bg-purple-50',
    iconColor: 'text-purple-600',
    trend:   3.2
  },
  {
    label:   'Products',
    value:   stats.value ? Number(stats.value.totalProducts ?? 0).toLocaleString() : '—',
    icon:    'inventory_2',
    iconBg:  'bg-green-50',
    iconColor: 'text-green-600',
    trend:   null
  },
])

const recentOrders = computed<Order[]>(() => stats.value?.recentOrders ?? [])

const orderStatuses = computed(() => {
  const byStatus = stats.value?.ordersByStatus ?? []
  const colors: Record<string, string> = {
    pending: 'bg-secondary', confirmed: 'bg-blue-400',
    processing: 'bg-primary-container', shipped: 'bg-purple-400',
    delivered: 'bg-green-500', cancelled: 'bg-error',
  }
  if (byStatus.length) {
    return byStatus.map((s: any) => ({ status: s.status, count: s.count, color: colors[s.status] ?? 'bg-secondary' }))
  }
  return Object.keys(colors).map(s => ({ status: s, count: 0, color: colors[s] }))
})

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending:    'bg-surface-container text-secondary',
    confirmed:  'bg-secondary-container text-on-surface',
    processing: 'bg-primary-fixed text-on-primary-fixed-variant',
    shipped:    'bg-secondary-container text-on-secondary-fixed-variant',
    delivered:  'bg-emerald-100 text-emerald-800',
    cancelled:  'bg-error-container text-on-error-container',
  }
  return map[status] ?? 'bg-surface-container text-secondary'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

useSeoMeta({ title: 'Dashboard — Admin' })
</script>
