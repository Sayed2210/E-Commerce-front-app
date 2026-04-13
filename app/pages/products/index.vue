<script setup lang="ts">
import type { Product, Category } from '~/types/api'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Products — ArchitectMarket' })

const route = useRoute()
const { listProducts } = useProducts()
const { listCategories } = useCategories()
const { addItem } = useCart()
const { addToWishlist } = useWishlist()

const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const selectedCategory = ref((route.query.category as string) ?? '')
const selectedPrice = ref('')
const selectedSort = ref('')
const filterOpen = ref(false) // mobile filter drawer

const priceRanges = [
  { label: 'Under $25', value: '0-25' },
  { label: '$25 – $100', value: '25-100' },
  { label: '$100 – $500', value: '100-500' },
  { label: 'Over $500', value: '500-99999' },
]

const sortOptions = [
  { label: 'Most Relevant', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
]

const [{ data: rawCategories }, { data, pending, refresh }] = await Promise.all([
  listCategories({ limit: 20 }),
  listProducts({
    page: currentPage.value,
    limit: 24,
    categoryId: selectedCategory.value || undefined,
  }),
])

const categories = computed<Category[]>(() => rawCategories.value ?? [])

watch([currentPage, selectedCategory, selectedSort, selectedPrice], () => {
  refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const products = computed<Product[]>(() => (data.value as any)?.data ?? (data.value as any) ?? [])
const total = computed<number>(() => (data.value as any)?.total ?? products.value.length)
const totalPages = computed<number>(() => (data.value as any)?.totalPages ?? 1)

const activeFiltersCount = computed(() => {
  let n = 0
  if (selectedCategory.value) n++
  if (selectedPrice.value) n++
  return n
})

function toggleCategory(slug: string) {
  selectedCategory.value = selectedCategory.value === slug ? '' : slug
  currentPage.value = 1
}

function clearFilters() {
  selectedCategory.value = ''
  selectedPrice.value = ''
  selectedSort.value = ''
  currentPage.value = 1
}

async function quickAdd(productId: string) {
  await addItem({ productId, quantity: 1 })
}

async function toggleWish(productId: string) {
  await addToWishlist(productId)
}
</script>

<template>
  <div class="page">
    <!-- ── Glass breadcrumb pill ──────────────────────────────────────────── -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink to="/" class="breadcrumb__item">Home</NuxtLink>
      <span class="material-symbols-outlined breadcrumb__sep" aria-hidden="true"
        >chevron_right</span
      >
      <span class="breadcrumb__item breadcrumb__item--current" aria-current="page"> Products </span>
      <template v-if="route.query.q">
        <span class="material-symbols-outlined breadcrumb__sep" aria-hidden="true"
          >chevron_right</span
        >
        <span class="breadcrumb__item breadcrumb__item--current"> "{{ route.query.q }}" </span>
      </template>
    </nav>

    <div class="layout">
      <!-- ── Sidebar ──────────────────────────────────────────────────────── -->
      <aside class="sidebar" :class="{ 'sidebar--open': filterOpen }" aria-label="Product filters">
        <!-- Close on mobile -->
        <button
          type="button"
          class="sidebar__close"
          aria-label="Close filters"
          @click="filterOpen = false"
        >
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>

        <!-- Department filter -->
        <div class="filter-group">
          <h3 id="dept-heading" class="filter-group__heading">Department</h3>
          <ul class="filter-group__list" role="list" aria-labelledby="dept-heading">
            <li v-for="cat in categories" :key="cat.slug">
              <button
                type="button"
                class="filter-btn"
                :class="{ 'filter-btn--active': selectedCategory === cat.slug }"
                :aria-pressed="selectedCategory === cat.slug"
                @click="toggleCategory(cat.slug)"
              >
                {{ cat.name }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Price range filter -->
        <div class="filter-group">
          <h3 id="price-heading" class="filter-group__heading">Price Range</h3>
          <fieldset class="filter-group__list" aria-labelledby="price-heading">
            <legend class="sr-only">Select price range</legend>
            <label v-for="range in priceRanges" :key="range.value" class="filter-radio">
              <input
                v-model="selectedPrice"
                type="radio"
                name="price"
                :value="range.value"
                class="filter-radio__input"
              />
              <span class="filter-radio__label">{{ range.label }}</span>
            </label>
          </fieldset>
        </div>

        <!-- Clear all -->
        <button
          v-if="activeFiltersCount > 0"
          type="button"
          class="filter-clear"
          @click="clearFilters"
        >
          <span class="material-symbols-outlined" aria-hidden="true">filter_alt_off</span>
          Clear all ({{ activeFiltersCount }})
        </button>
      </aside>

      <!-- Backdrop for mobile filter -->
      <div
        v-if="filterOpen"
        class="sidebar__backdrop"
        aria-hidden="true"
        @click="filterOpen = false"
      />

      <!-- ── Main ──────────────────────────────────────────────────────────── -->
      <main class="main" aria-label="Products listing">
        <!-- Results bar -->
        <div class="results-bar">
          <div class="results-bar__left">
            <h1 class="results-bar__title">
              {{ route.query.q ? `Results for "${route.query.q}"` : 'All Products' }}
            </h1>
            <p class="results-bar__count" aria-live="polite">{{ total.toLocaleString() }} items</p>
          </div>

          <div class="results-bar__right">
            <!-- Mobile filter toggle -->
            <button
              type="button"
              class="results-bar__filter-btn"
              :aria-expanded="filterOpen"
              aria-controls="product-filters"
              @click="filterOpen = true"
            >
              <span class="material-symbols-outlined" aria-hidden="true">filter_list</span>
              Filters
              <span v-if="activeFiltersCount > 0" class="results-bar__filter-badge">
                {{ activeFiltersCount }}
              </span>
            </button>

            <!-- Sort select -->
            <label class="sr-only" for="sort-select">Sort products by</label>
            <select id="sort-select" v-model="selectedSort" class="results-bar__sort">
              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>

            <!-- View mode toggle -->
            <div class="view-toggle" role="group" aria-label="View mode">
              <button
                type="button"
                class="view-toggle__btn"
                :class="{ 'view-toggle__btn--active': viewMode === 'grid' }"
                :aria-pressed="viewMode === 'grid'"
                aria-label="Grid view"
                @click="viewMode = 'grid'"
              >
                <span class="material-symbols-outlined" aria-hidden="true">grid_view</span>
              </button>
              <button
                type="button"
                class="view-toggle__btn"
                :class="{ 'view-toggle__btn--active': viewMode === 'list' }"
                :aria-pressed="viewMode === 'list'"
                aria-label="List view"
                @click="viewMode = 'list'"
              >
                <span class="material-symbols-outlined" aria-hidden="true">view_list</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Skeleton -->
        <ul
          v-if="pending"
          :class="viewMode === 'grid' ? 'product-grid' : 'product-list'"
          role="list"
          aria-label="Loading products"
          aria-busy="true"
        >
          <li v-for="i in 12" :key="i">
            <ProductSkeleton :variant="viewMode" />
          </li>
        </ul>

        <!-- Products -->
        <ul
          v-else-if="products.length > 0"
          :class="viewMode === 'grid' ? 'product-grid' : 'product-list'"
          role="list"
          :aria-label="`${products.length} products`"
        >
          <li v-for="product in products" :key="product.id">
            <ProductCard
              :product="product"
              :variant="viewMode"
              :wishlist="true"
              @add-to-cart="quickAdd"
              @toggle-wish="toggleWish"
            />
          </li>
        </ul>

        <!-- Empty state -->
        <div v-else class="empty" role="status">
          <span class="material-symbols-outlined empty__icon" aria-hidden="true">search_off</span>
          <h3 class="empty__title">No products found</h3>
          <p class="empty__body">Try adjusting your filters or search query.</p>
          <button type="button" class="empty__reset" @click="clearFilters">
            Clear all filters
          </button>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="pagination" aria-label="Product listing pages">
          <button
            type="button"
            class="pagination__btn"
            :disabled="currentPage === 1"
            aria-label="Previous page"
            @click="currentPage--"
          >
            <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
          </button>

          <template v-for="p in totalPages" :key="p">
            <!-- Show first, last, current ±1, and ellipsis -->
            <template v-if="p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1">
              <button
                type="button"
                class="pagination__page"
                :class="{ 'pagination__page--active': currentPage === p }"
                :aria-label="`Page ${p}`"
                :aria-current="currentPage === p ? 'page' : undefined"
                @click="currentPage = p"
              >
                {{ p }}
              </button>
            </template>
            <span
              v-else-if="p === currentPage - 2 || p === currentPage + 2"
              class="pagination__ellipsis"
              aria-hidden="true"
              >…</span
            >
          </template>

          <button
            type="button"
            class="pagination__btn"
            :disabled="currentPage === totalPages"
            aria-label="Next page"
            @click="currentPage++"
          >
            <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
          </button>
        </nav>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ────────────────────────────────────────────────────────────────── */
.page {
  max-width: 88rem;
  margin-inline: auto;
  padding: 1.5rem 1.5rem 4rem;
}

/* ── Glassmorphic breadcrumb pill ────────────────────────────────────────── */
.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: color-mix(in srgb, var(--color-surface-container-lowest) 75%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--color-outline-variant) 20%, transparent);
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  margin-bottom: 1.75rem;
}

.breadcrumb__item {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 180ms ease;
}

.breadcrumb__item:hover:not(.breadcrumb__item--current) {
  color: var(--color-primary);
}

.breadcrumb__item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.breadcrumb__item--current {
  color: var(--color-on-surface);
}

.breadcrumb__sep {
  font-size: 0.75rem;
  color: var(--color-outline-variant);
}

/* ── Two-column layout ───────────────────────────────────────────────────── */
.layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

/* ── Sidebar ─────────────────────────────────────────────────────────────── */
.sidebar {
  width: 13rem;
  flex-shrink: 0;
  display: none;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: calc(var(--nav-height, 7rem) + 1rem);
}

@media (width >= 768px) {
  .sidebar {
    display: flex;
  }
}

/* Mobile: slide-in drawer */
@media (width <= 767px) {
  .sidebar--open {
    display: flex;
    position: fixed;
    inset-block: 0;
    left: 0;
    width: 18rem;
    z-index: 60;
    background: var(--color-surface-container-lowest);
    padding: 1.5rem;
    overflow-y: auto;
    box-shadow: 4px 0 40px color-mix(in srgb, var(--color-on-surface) 12%, transparent);
    top: 0;
  }
}

.sidebar__close {
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
    color 180ms ease,
    background 180ms ease;
}

@media (width <= 767px) {
  .sidebar__close {
    display: flex;
  }
}

.sidebar__close:hover {
  color: var(--color-primary);
  background: var(--color-surface-container-low);
}

.sidebar__backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-on-surface) 40%, transparent);
  z-index: 59;
  backdrop-filter: blur(2px);
}

/* Filter groups */
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
  transition: color 180ms ease;
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

/* Radio filters */
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
  transition: color 180ms ease;
}

.filter-radio:hover .filter-radio__label {
  color: var(--color-on-surface);
}

/* Clear button */
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
  transition: color 180ms ease;
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

/* ── Main ────────────────────────────────────────────────────────────────── */
.main {
  flex: 1;
  min-width: 0;
}

/* ── Results bar ─────────────────────────────────────────────────────────── */
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

/* Mobile filter button */
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
    color 180ms ease,
    background 180ms ease;
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

/* Sort */
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
  transition: box-shadow 200ms ease;
}

.results-bar__sort:focus-visible {
  box-shadow: 0 0 0 2px var(--color-primary);
}

/* View toggle */
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
    background 180ms ease,
    color 180ms ease;
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

/* ── Product grids ───────────────────────────────────────────────────────── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.125rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (width >= 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 900px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 1200px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  text-align: center;
  gap: 0.75rem;
}

.empty__icon {
  font-size: 3.5rem;
  color: var(--color-secondary);
  opacity: 0.3;
}

.empty__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.empty__body {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-secondary);
  margin: 0;
}

.empty__reset {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 200ms ease;
}

.empty__reset:hover {
  opacity: 0.75;
}

.empty__reset:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* ── Pagination ──────────────────────────────────────────────────────────── */
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
    background 180ms ease,
    color 180ms ease;
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

/* ── Utility ─────────────────────────────────────────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
}
</style>
