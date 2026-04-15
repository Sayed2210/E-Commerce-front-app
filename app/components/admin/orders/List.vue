<script setup lang="ts">
import { useOrdersTableData } from '~/composables/admin/useOrdersTableData'

const {
  search,
  statusFilter,
  currentPage,
  statuses,
  filteredOrders,
  total,
  totalPages,
  pending,
  updateStatus,
} = await useOrdersTableData()

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleStatusUpdate(orderId: string, status: string) {
  updateStatus(orderId, status)
}

function handleExport() {
  // TODO: Implement export functionality
  console.log('Export orders')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold font-headline text-on-surface">Orders</h2>
        <p class="text-secondary text-sm">{{ total }} total orders</p>
      </div>
      <AdminOrdersToolbar
        :search="search"
        :status-filter="statusFilter"
        :statuses="statuses"
        :loading="pending"
        @update:search="search = $event"
        @update:status-filter="statusFilter = $event"
        @export="handleExport"
      />
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden">
      <table class="w-full">
        <AdminOrdersTableHeader />

        <AdminSharedDataTableSkeleton v-if="pending" :rows="8" :columns="7" />

        <tbody v-else class="divide-y divide-outline-variant/10">
          <AdminOrdersTableRow
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
            :statuses="statuses"
            @update:status="handleStatusUpdate(order.id, $event)"
          />
          <tr v-if="!filteredOrders.length">
            <td colspan="7" class="px-6 py-12 text-center text-secondary text-sm">
              No orders found
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <AdminSharedDataTablePagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :loading="pending"
        @update:current-page="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* Page composition styles */
</style>
