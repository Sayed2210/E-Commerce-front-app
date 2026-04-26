<script setup lang="ts">
import type { Product } from '~/types/api'

interface Props {
  product: Product
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [id: string]
}>()

function getProductName(product: Product): string {
  return typeof product.name === 'string' ? product.name : (product.name?.en ?? '')
}

function handleDelete() {
  emit('delete', props.product.id)
}
</script>

<template>
  <tr class="hover:bg-surface-container-low transition-colors">
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-surface-container-low rounded overflow-hidden shrink-0">
          <img
            v-if="product.images?.[0]"
            :src="product.images[0]"
            class="w-full h-full object-cover"
            :alt="getProductName(product)"
          />
        </div>
        <div>
          <p class="text-sm font-semibold text-on-surface line-clamp-1">
            {{ getProductName(product) }}
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
      <StatusBadge :status="product.isActive ? 'active' : 'inactive'" size="sm" />
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/admin/products/${product.id}/edit`"
          class="text-primary hover:underline text-xs font-semibold"
        >
          Edit
        </NuxtLink>
        <button
          type="button"
          class="text-error hover:underline text-xs font-semibold"
          aria-label="Delete product"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
/* Table row styles */
</style>
