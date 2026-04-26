<script setup lang="ts">
// import type { Component } from 'vue'

interface Props {
  pending?: boolean
  empty?: boolean
  emptyText?: string
  pagination?: boolean
  currentPage?: number
  totalPages?: number
  columnCount?: number
}

const {
  pending = false,
  empty = false,
  emptyText = 'No data available.',
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  columnCount = 5,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

function goToPrev() {
  if (currentPage > 1) {
    emit('update:currentPage', currentPage - 1)
  }
}

function goToNext() {
  if (currentPage < totalPages) {
    emit('update:currentPage', currentPage + 1)
  }
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden">
    <table class="w-full">
      <slot name="header" />
      <AdminSharedDataTableSkeleton v-if="pending" :columns="columnCount" />
      <tbody v-else-if="empty" class="divide-y divide-outline-variant/10">
        <tr>
          <td :colspan="columnCount" class="px-6 py-12 text-center text-secondary text-sm">
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
      <tbody v-else class="divide-y divide-outline-variant/10">
        <slot />
      </tbody>
    </table>
    <div
      v-if="pagination && totalPages > 1"
      class="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10"
    >
      <p class="text-xs text-secondary">Page {{ currentPage }} of {{ totalPages }}</p>
      <div class="flex gap-2">
        <button
          type="button"
          :disabled="currentPage <= 1"
          class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low transition-colors"
          @click="goToPrev"
        >
          Prev
        </button>
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low transition-colors"
          @click="goToNext"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Admin data table styles */
</style>
