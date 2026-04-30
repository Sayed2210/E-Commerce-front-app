<script setup lang="ts">
import type { Order } from '~/types/api'
import { useStatusColors } from '~/composables/admin/useStatusColors'
import { useInvoices } from '~/composables/useInvoices'

interface Props {
  order: Order
  statuses: string[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:status': [status: string]
}>()

const { getStatusClass } = useStatusColors()
const { resendInvoice } = useInvoices()

const { locale } = useI18n()

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getOrderId(orderId: string): string {
  return `#${orderId.slice(0, 8).toUpperCase()}`
}

function handleStatusChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:status', target.value)
}
</script>

<template>
  <tr class="hover:bg-surface-container-low transition-colors">
    <td class="px-6 py-4">
      <span class="font-bold text-sm text-on-surface font-headline">
        {{ getOrderId(order.id) }}
      </span>
    </td>
    <td class="px-6 py-4 hidden md:table-cell">
      <div>
        <p class="text-sm text-on-surface font-semibold">
          {{ order.user?.firstName ?? '' }} {{ order.user?.lastName ?? '' }}
        </p>
        <p class="text-xs text-secondary">{{ order.user?.email ?? '—' }}</p>
      </div>
    </td>
    <td class="px-6 py-4 hidden lg:table-cell text-sm text-secondary">
      {{ formatDate(order.createdAt) }}
    </td>
    <td class="px-6 py-4 hidden lg:table-cell">
      <span class="micro-chip bg-surface-container text-secondary capitalize">
        {{ order.paymentMethod }}
      </span>
    </td>
    <td class="px-6 py-4">
      <span class="text-sm font-bold text-on-surface">${{ order.totalAmount.toFixed(2) }}</span>
    </td>
    <td class="px-6 py-4">
      <select
        :value="order.status"
        :class="getStatusClass(order.status)"
        class="text-xs font-bold uppercase rounded-full px-3 py-1 border-none outline-none cursor-pointer"
        :aria-label="`${$t('admin.ordersPage.orderId')} ${getOrderId(order.id)} ${$t('admin.ordersPage.status')}`"
        @change="handleStatusChange"
      >
        <option v-for="s in statuses" :key="s" :value="s" class="capitalize">
          {{ $t(`admin.orderStatus.${s}`) }}
        </option>
      </select>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/admin/orders/${order.id}`"
          class="text-primary hover:underline text-xs font-semibold"
        >
          {{ $t('admin.ordersPage.view') }}
        </NuxtLink>
        <button
          v-if="order.paymentStatus === 'paid' || order.status === 'delivered'"
          type="button"
          class="text-secondary hover:text-primary text-xs font-semibold transition-colors"
          @click="resendInvoice(order.id)"
        >
          {{ $t('invoice.resend') }}
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
/* Table row styles */
</style>
