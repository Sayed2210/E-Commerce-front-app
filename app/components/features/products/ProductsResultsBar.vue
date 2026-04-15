<script setup lang="ts">
import { SORT_OPTIONS } from '~/composables/useProductFilters'

defineProps<{
  total: number
  query?: string
  viewMode: 'grid' | 'list'
  selectedSort: string
  activeFiltersCount: number
}>()

const emit = defineEmits<{
  'update:viewMode': [value: 'grid' | 'list']
  'update:selectedSort': [value: string]
  'open-filters': []
}>()
</script>

<template>
  <div class="results-bar">
    <div class="results-bar__left">
      <h1 class="results-bar__title">
        {{ query ? `Results for "${query}"` : 'All Products' }}
      </h1>
      <p class="results-bar__count" aria-live="polite">{{ total.toLocaleString() }} items</p>
    </div>

    <div class="results-bar__right">
      <button
        type="button"
        class="results-bar__filter-btn"
        :aria-expanded="false"
        aria-controls="product-filters"
        @click="emit('open-filters')"
      >
        <span class="material-symbols-outlined" aria-hidden="true">filter_list</span>
        Filters
        <span v-if="activeFiltersCount > 0" class="results-bar__filter-badge">
          {{ activeFiltersCount }}
        </span>
      </button>

      <label class="sr-only" for="sort-select">Sort products by</label>
      <select
        id="sort-select"
        :value="selectedSort"
        class="results-bar__sort"
        @change="emit('update:selectedSort', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <div class="view-toggle" role="group" aria-label="View mode">
        <button
          type="button"
          class="view-toggle__btn"
          :class="{ 'view-toggle__btn--active': viewMode === 'grid' }"
          :aria-pressed="viewMode === 'grid'"
          aria-label="Grid view"
          @click="emit('update:viewMode', 'grid')"
        >
          <span class="material-symbols-outlined" aria-hidden="true">grid_view</span>
        </button>
        <button
          type="button"
          class="view-toggle__btn"
          :class="{ 'view-toggle__btn--active': viewMode === 'list' }"
          :aria-pressed="viewMode === 'list'"
          aria-label="List view"
          @click="emit('update:viewMode', 'list')"
        >
          <span class="material-symbols-outlined" aria-hidden="true">view_list</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.results-bar__left {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.results-bar__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.results-bar__count {
  font-family: var(--font-label);
  font-size: 0.75rem;
  color: var(--color-secondary);
  margin: 0;
}

.results-bar__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.results-bar__filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-secondary);
  background: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-DEFAULT);
  padding: 0.5rem 0.875rem;
  cursor: pointer;
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
  position: relative;
}

@media (width >= 768px) {
  .results-bar__filter-btn {
    display: none;
  }
}

.results-bar__filter-btn:hover {
  color: var(--color-primary);
  background: var(--color-surface-container);
}

.results-bar__filter-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.results-bar__filter-btn .material-symbols-outlined {
  font-size: 1rem;
}

.results-bar__filter-badge {
  position: absolute;
  top: -0.3rem;
  right: -0.3rem;
  width: 1.1rem;
  height: 1.1rem;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-full);
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-bar__sort {
  background: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-DEFAULT);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-on-surface);
  outline: none;
  cursor: pointer;
  transition: box-shadow var(--transition-base);
}

.results-bar__sort:focus-visible {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.view-toggle {
  display: flex;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-DEFAULT);
  padding: 0.1875rem;
  gap: 0.125rem;
}

.view-toggle__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  border-radius: calc(var(--radius-DEFAULT) - 0.0625rem);
  cursor: pointer;
  color: var(--color-secondary);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.view-toggle__btn:hover {
  color: var(--color-primary);
}

.view-toggle__btn--active {
  background: var(--color-surface-container-lowest);
  color: var(--color-primary);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--color-on-surface) 8%, transparent);
}

.view-toggle__btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}
</style>
