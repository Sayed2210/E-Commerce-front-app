<script setup lang="ts">
import type { Order, Product } from '~/types/api'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { listOrders } = useOrders()
const activeTab = ref('all')

const tabs = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
]

const trackingSteps = ['Confirmed', 'Processing', 'Shipped', 'Delivered']

const { data, pending } = await listOrders({ limit: 20 })
const orders = computed<Order[]>(() => (data.value as any)?.data ?? (data.value as any) ?? [])
const filteredOrders = computed(() =>
  activeTab.value === 'all'
    ? orders.value
    : orders.value.filter((o) => o.status === activeTab.value)
)

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

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-surface-container text-secondary',
    confirmed: 'bg-secondary-container text-on-surface',
    processing: 'bg-primary-fixed text-on-primary-fixed-variant',
    shipped: 'bg-secondary-container text-on-secondary-fixed-variant',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-error-container text-on-error-container',
    refunded: 'bg-surface-container text-secondary',
  }
  return map[status] ?? 'bg-surface-container text-secondary'
}

function stepComplete(orderStatus: string, step: string) {
  const order = ['confirmed', 'processing', 'shipped', 'delivered']
  const stepIdx = ['Confirmed', 'Processing', 'Shipped', 'Delivered'].indexOf(step)
  const statusIdx = order.indexOf(orderStatus)
  return statusIdx >= stepIdx
}

function openReturnDialog(_orderId: string) {
  // TODO: open return modal
}

useSeoMeta({ title: 'My Orders — ArchitectMarket' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <!-- Header -->
    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-on-surface font-headline">My Orders</h1>
        <p class="text-secondary text-sm mt-1">Track and manage your purchases</p>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-1 bg-surface-container-low rounded p-1 mb-8 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        :class="
          activeTab === tab.value
            ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm'
            : 'text-secondary hover:text-on-surface'
        "
        class="px-4 py-2 rounded text-sm transition-all"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-surface-container-lowest rounded p-6 animate-pulse space-y-3"
      >
        <div class="h-5 bg-surface-container-low rounded w-1/4"></div>
        <div class="h-4 bg-surface-container-low rounded w-1/2"></div>
        <div class="h-3 bg-surface-container-low rounded w-1/3"></div>
      </div>
    </div>

    <!-- Orders list -->
    <div v-else-if="filteredOrders.length" class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-surface-container-lowest rounded overflow-hidden hover:shadow-ambient transition-all"
      >
        <!-- Order header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <div class="flex items-center gap-6">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-secondary">Order</p>
              <p class="font-bold text-on-surface text-sm font-headline">
                #{{ order.id.slice(0, 8).toUpperCase() }}
              </p>
            </div>
            <div>
              <p class="text-xs text-secondary">Placed</p>
              <p class="text-sm font-semibold text-on-surface">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-xs text-secondary">Total</p>
              <p class="text-sm font-bold text-on-surface">${{ order.total.toFixed(2) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              :class="statusClass(order.status)"
              class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
            >
              {{ order.status }}
            </span>
            <NuxtLink
              :to="`/orders/${order.id}`"
              class="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
            >
              View details <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Order items preview -->
        <div class="px-6 py-4 flex items-center gap-4">
          <div
            v-for="item in order.items.slice(0, 4)"
            :key="item.id"
            class="w-14 h-14 bg-surface-container-low rounded overflow-hidden shrink-0"
          >
            <img
              v-if="item.product?.images?.[0]"
              :src="item.product.images[0]"
              :alt="productName(item.product)"
              class="w-full h-full object-cover"
            />
          </div>
          <p v-if="order.items.length > 4" class="text-xs text-secondary font-bold">
            +{{ order.items.length - 4 }} more items
          </p>
          <div class="ml-auto flex gap-2">
            <button
              v-if="order.status === 'delivered'"
              type="button"
              class="text-xs border border-outline-variant/30 text-on-surface px-4 py-2 rounded hover:bg-surface-container-low transition-colors"
              @click="openReturnDialog(order.id)"
            >
              Request Return
            </button>
            <button
              v-if="['pending', 'confirmed'].includes(order.status)"
              type="button"
              class="text-xs text-error hover:underline transition-colors"
            >
              Cancel Order
            </button>
          </div>
        </div>

        <!-- Tracking bar -->
        <div v-if="!['cancelled', 'refunded'].includes(order.status)" class="px-6 pb-4">
          <div class="flex items-center gap-0">
            <div
              v-for="(step, i) in trackingSteps"
              :key="step"
              class="flex items-center"
              :class="i < trackingSteps.length - 1 ? 'flex-1' : ''"
            >
              <div class="flex flex-col items-center">
                <div
                  :class="
                    stepComplete(order.status, step)
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container text-secondary'
                  "
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                >
                  <span
                    class="material-symbols-outlined text-[12px]"
                    :style="
                      stepComplete(order.status, step) ? `font-variation-settings: 'FILL' 1` : ''
                    "
                    >check</span
                  >
                </div>
                <p class="text-[9px] text-secondary mt-1 text-center whitespace-nowrap">
                  {{ step }}
                </p>
              </div>
              <div
                v-if="i < trackingSteps.length - 1"
                :class="
                  stepComplete(order.status, trackingSteps[i + 1] ?? '')
                    ? 'bg-primary-container'
                    : 'bg-surface-container'
                "
                class="flex-1 h-0.5 transition-colors mx-1"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-24">
      <span class="material-symbols-outlined text-7xl text-secondary/20 block mb-4"
        >shopping_bag</span
      >
      <h2 class="text-2xl font-bold text-on-surface font-headline mb-2">No orders yet</h2>
      <p class="text-secondary text-sm mb-6">When you place an order, it will appear here.</p>
      <NuxtLink
        to="/products"
        class="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all"
      >
        Start Shopping
      </NuxtLink>
    </div>
  </div>
</template>
