<script setup lang="ts">
import type { Product } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listProducts, deleteProduct: apiDelete } = useProducts()
const search = ref('')
const statusFilter = ref('')
const currentPage = ref(1)

const { data, pending, refresh } = await listProducts({ page: currentPage.value, limit: 20 })
watch(currentPage, () => refresh())

const products = computed<Product[]>(() => (data.value as any)?.data ?? (data.value as any) ?? [])
const total = computed<number>(() => (data.value as any)?.total ?? products.value.length)
const totalPages = computed<number>(() => (data.value as any)?.totalPages ?? 1)

const filteredProducts = computed(() =>
  products.value.filter((p) => {
    const name = productName(p).toLowerCase()
    const matchSearch = !search.value || name.includes(search.value.toLowerCase())
    const matchStatus =
      !statusFilter.value || (statusFilter.value === 'active' ? p.isActive : !p.isActive)
    return matchSearch && matchStatus
  })
)

function productName(p: Product) {
  return typeof p.name === 'string' ? p.name : (p.name?.en ?? '')
}

async function deleteProduct(id: string) {
  if (!confirm('Delete this product?')) return
  await apiDelete(id)
  await refresh()
}

useSeoMeta({ title: 'Inventory — Admin' })
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
    <div class="flex gap-3">
      <div class="relative flex-1 max-w-xs">
        <span
          class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm"
          >search</span
        >
        <input
          v-model="search"
          type="text"
          placeholder="Search products…"
          class="w-full bg-surface-container-lowest border border-outline-variant/20 rounded pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
        />
      </div>
      <select
        v-model="statusFilter"
        class="bg-surface-container-lowest border border-outline-variant/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-on-surface"
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container-low">
          <tr>
            <th
              class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary"
            >
              Product
            </th>
            <th
              class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary hidden md:table-cell"
            >
              Category
            </th>
            <th
              class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary"
            >
              Price
            </th>
            <th
              class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary hidden sm:table-cell"
            >
              Stock
            </th>
            <th
              class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary"
            >
              Status
            </th>
            <th
              class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody v-if="pending">
          <tr v-for="i in 8" :key="i" class="border-t border-outline-variant/10 animate-pulse">
            <td v-for="j in 6" :key="j" class="px-6 py-4">
              <div class="h-4 bg-surface-container-low rounded w-full"></div>
            </td>
          </tr>
        </tbody>
        <tbody v-else class="divide-y divide-outline-variant/10">
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-surface-container-low transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-surface-container-low rounded overflow-hidden shrink-0">
                  <img
                    v-if="product.images?.[0]"
                    :src="product.images[0]"
                    class="w-full h-full object-cover"
                    :alt="productName(product)"
                  />
                </div>
                <div>
                  <p class="text-sm font-semibold text-on-surface line-clamp-1">
                    {{ productName(product) }}
                  </p>
                  <p class="text-xs text-secondary">{{ product.brand?.name ?? '' }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 hidden md:table-cell">
              <span class="text-sm text-secondary">{{ product.category?.name ?? '—' }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm font-bold text-on-surface">${{ product.basePrice }}</span>
            </td>
            <td class="px-6 py-4 hidden sm:table-cell">
              <span
                :class="product.inventoryQuantity < 10 ? 'text-error font-bold' : 'text-secondary'"
                class="text-sm"
                >{{ product.inventoryQuantity }}</span
              >
            </td>
            <td class="px-6 py-4">
              <span
                :class="
                  product.isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-surface-container text-secondary'
                "
                class="micro-chip"
                >{{ product.isActive ? 'Active' : 'Inactive' }}</span
              >
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <NuxtLink
                  :to="`/admin/products/${product.id}/edit`"
                  class="text-primary hover:underline text-xs font-semibold"
                  >Edit</NuxtLink
                >
                <button
                  type="button"
                  class="text-error hover:underline text-xs font-semibold"
                  @click="deleteProduct(product.id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredProducts.length">
            <td colspan="6" class="px-6 py-12 text-center text-secondary text-sm">
              No products found
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10"
      >
        <p class="text-xs text-secondary">Page {{ currentPage }} of {{ totalPages }}</p>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low"
            @click="currentPage--"
          >
            Prev
          </button>
          <button
            type="button"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
