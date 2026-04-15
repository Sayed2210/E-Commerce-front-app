<script setup lang="ts">
import type { Category } from '~/types/api'
import { PRICE_RANGES } from '~/composables/useProductFilters'

defineProps<{
  categories: Category[]
  selectedCategory: string
  selectedPrice: string
  filterOpen: boolean
  activeFiltersCount: number
}>()

const emit = defineEmits<{
  'update:selectedCategory': [value: string]
  'update:selectedPrice': [value: string]
  'update:filterOpen': [value: boolean]
  clear: []
}>()
</script>

<template>
  <aside
    id="product-filters"
    class="filters"
    :class="{ 'filters--open': filterOpen }"
    aria-label="Product filters"
  >
    <button
      type="button"
      class="filters__close"
      aria-label="Close filters"
      @click="emit('update:filterOpen', false)"
    >
      <span class="material-symbols-outlined" aria-hidden="true">close</span>
    </button>

    <div class="filter-group">
      <h3 id="dept-heading" class="filter-group__heading">Department</h3>
      <ul class="filter-group__list" role="list" aria-labelledby="dept-heading">
        <li v-for="cat in categories" :key="cat.slug">
          <button
            type="button"
            class="filter-btn"
            :class="{ 'filter-btn--active': selectedCategory === cat.slug }"
            :aria-pressed="selectedCategory === cat.slug"
            @click="emit('update:selectedCategory', selectedCategory === cat.slug ? '' : cat.slug)"
          >
            {{ cat.name }}
          </button>
        </li>
      </ul>
    </div>

    <div class="filter-group">
      <h3 id="price-heading" class="filter-group__heading">Price Range</h3>
      <fieldset class="filter-group__list" aria-labelledby="price-heading">
        <legend class="sr-only">Select price range</legend>
        <label v-for="range in PRICE_RANGES" :key="range.value" class="filter-radio">
          <input
            :checked="selectedPrice === range.value"
            type="radio"
            name="price"
            :value="range.value"
            class="filter-radio__input"
            @change="emit('update:selectedPrice', range.value)"
          />
          <span class="filter-radio__label">{{ range.label }}</span>
        </label>
      </fieldset>
    </div>

    <button v-if="activeFiltersCount > 0" type="button" class="filter-clear" @click="emit('clear')">
      <span class="material-symbols-outlined" aria-hidden="true">filter_alt_off</span>
      Clear all ({{ activeFiltersCount }})
    </button>
  </aside>

  <div
    v-if="filterOpen"
    class="filters__backdrop"
    aria-hidden="true"
    @click="emit('update:filterOpen', false)"
  />
</template>

<style scoped>
.filters {
  width: 13rem;
  flex-shrink: 0;
  display: none;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: calc(var(--nav-height, 7rem) + 1rem);
}

@media (width >= 768px) {
  .filters {
    display: flex;
  }
}

@media (width <= 767px) {
  .filters--open {
    display: flex;
    position: fixed;
    inset-block: 0;
    left: 0;
    width: 18rem;
    z-index: var(--z-drawer);
    background: var(--color-surface-container-lowest);
    padding: 1.5rem;
    overflow-y: auto;
    box-shadow: 4px 0 40px color-mix(in srgb, var(--color-on-surface) 12%, transparent);
    top: 0;
  }
}

.filters__close {
  display: none;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  margin-bottom: 0.5rem;
  transition:
    color var(--transition-fast),
    background var(--transition-fast);
}

@media (width <= 767px) {
  .filters__close {
    display: flex;
  }
}

.filters__close:hover {
  color: var(--color-primary);
  background: var(--color-surface-container-low);
}

.filters__backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-on-surface) 40%, transparent);
  z-index: calc(var(--z-drawer) - 1);
  backdrop-filter: blur(2px);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.filter-group__heading {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-on-surface);
  margin: 0;
}

.filter-group__list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  border: none;
}

.filter-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
  text-align: left;
  padding: 0.25rem 0;
  width: 100%;
  transition: color var(--transition-fast);
}

.filter-btn:hover {
  color: var(--color-on-surface);
}

.filter-btn--active {
  color: var(--color-primary);
  font-weight: 600;
}

.filter-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.filter-radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.filter-radio__input {
  width: 0.875rem;
  height: 0.875rem;
  accent-color: var(--color-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.filter-radio__label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
  transition: color var(--transition-fast);
}

.filter-radio:hover .filter-radio__label {
  color: var(--color-on-surface);
}

.filter-clear {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-secondary);
  padding: 0;
  transition: color var(--transition-fast);
}

.filter-clear:hover {
  color: var(--color-error);
}

.filter-clear:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.filter-clear .material-symbols-outlined {
  font-size: 0.875rem;
}
</style>
