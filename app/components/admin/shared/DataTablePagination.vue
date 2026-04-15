<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const canGoPrev = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < props.totalPages)

function goToPrev() {
  if (canGoPrev.value) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

function goToNext() {
  if (canGoNext.value) {
    emit('update:currentPage', props.currentPage + 1)
  }
}
</script>

<template>
  <div class="flex items-center justify-between px-6 py-4 border-t border-outline-variant/10">
    <p class="text-xs text-secondary">Page {{ currentPage }} of {{ totalPages }}</p>
    <div class="flex gap-2">
      <button
        type="button"
        :disabled="!canGoPrev || loading"
        class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low transition-colors"
        aria-label="Previous page"
        @click="goToPrev"
      >
        Prev
      </button>
      <button
        type="button"
        :disabled="!canGoNext || loading"
        class="px-3 py-1.5 text-xs rounded border border-outline-variant/20 disabled:opacity-40 hover:bg-surface-container-low transition-colors"
        aria-label="Next page"
        @click="goToNext"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Pagination shared styles */
</style>
