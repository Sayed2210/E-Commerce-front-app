<script setup lang="ts">
import { useProductsTableData } from '~/composables/admin/useProductsTableData'

const {
  search,
  statusFilter,
  currentPage,
  filteredProducts,
  total,
  totalPages,
  pending,
  deleteProduct,
} = await useProductsTableData()

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleDelete(id: string) {
  deleteProduct(id)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold font-headline text-on-surface">Inventory</h2>
        <p class="text-secondary text-sm">{{ total }} products in catalog</p>
      </div>
      <NuxtLink
        to="/admin/products/create"
        class="bg-primary-container text-on-primary-container px-5 py-2.5 rounded font-bold text-sm flex items-center gap-2 hover:brightness-95 transition-all"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        New Product
      </NuxtLink>
    </div>

    <!-- Filters -->
    <ProductsToolbar
      :search="search"
      :status-filter="statusFilter"
      :loading="pending"
      @update:search="search = $event"
      @update:status-filter="statusFilter = $event"
    />

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden">
      <table class="w-full">
        <ProductsTableHeader />
        <DataTableSkeleton v-if="pending" :rows="8" :columns="6" />
        <tbody v-else class="divide-y divide-outline-variant/10">
          <ProductsTableRow
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @delete="handleDelete"
          />
          <tr v-if="!filteredProducts.length">
            <td colspan="6" class="px-6 py-12 text-center text-secondary text-sm">
              No products found
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <DataTablePagination
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
