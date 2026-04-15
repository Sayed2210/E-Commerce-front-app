<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  totalPages: number
}>()

const emit = defineEmits<{ 'update:modelValue': [page: number] }>()

function isVisible(p: number) {
  return p === 1 || p === props.totalPages || Math.abs(p - props.modelValue) <= 1
}

function isEllipsis(p: number) {
  return p === props.modelValue - 2 || p === props.modelValue + 2
}
</script>

<template>
  <nav class="pagination" aria-label="Product listing pages">
    <button
      type="button"
      class="pagination__btn"
      :disabled="modelValue === 1"
      aria-label="Previous page"
      @click="emit('update:modelValue', modelValue - 1)"
    >
      <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
    </button>

    <template v-for="p in totalPages" :key="p">
      <template v-if="isVisible(p)">
        <button
          type="button"
          class="pagination__page"
          :class="{ 'pagination__page--active': modelValue === p }"
          :aria-label="`Page ${p}`"
          :aria-current="modelValue === p ? 'page' : undefined"
          @click="emit('update:modelValue', p)"
        >
          {{ p }}
        </button>
      </template>
      <span v-else-if="isEllipsis(p)" class="pagination__ellipsis" aria-hidden="true">…</span>
    </template>

    <button
      type="button"
      class="pagination__btn"
      :disabled="modelValue === totalPages"
      aria-label="Next page"
      @click="emit('update:modelValue', modelValue + 1)"
    >
      <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.pagination__btn,
.pagination__page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: var(--radius-DEFAULT);
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.pagination__btn {
  background: var(--color-surface-container-lowest);
  color: var(--color-secondary);
}

.pagination__btn:hover:not(:disabled) {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
}

.pagination__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pagination__page {
  background: var(--color-surface-container-lowest);
  color: var(--color-secondary);
  padding-inline: 0.625rem;
}

.pagination__page:hover:not(.pagination__page--active) {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
}

.pagination__page--active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
}

.pagination__btn:focus-visible,
.pagination__page:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.pagination__ellipsis {
  font-family: var(--font-label);
  font-size: 0.875rem;
  color: var(--color-secondary);
  padding-inline: 0.25rem;
  display: flex;
  align-items: center;
  height: 2.25rem;
}
</style>
