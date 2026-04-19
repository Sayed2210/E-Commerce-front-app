<script setup lang="ts">
import type { Product, Category } from '~/types/api'

definePageMeta({ layout: 'default' })
useSeoMeta({
  title: 'Products',
  description:
    'Browse our full catalog of precision architectural tools, materials, and equipment. Filter by category, price, and more.',
  ogTitle: 'Products — ArchitectMarket',
  ogDescription: 'Browse our full catalog of precision architectural tools and materials.',
  ogType: 'website',
  ogImage: '/og-products.jpg',
  twitterCard: 'summary_large_image',
})

const canonicalUrl = computed(() => `${useRequestURL().origin}/products`)
useHead({ link: [{ rel: 'canonical', href: canonicalUrl }] })

const route = useRoute()
const { listProducts } = useProducts()
const { listCategories } = useCategories()
const { addItem } = useCart()
const { addToWishlist } = useWishlist()

const {
  selectedCategory,
  selectedPrice,
  selectedSort,
  currentPage,
  filterOpen,
  activeFiltersCount,
  clearFilters,
} = useProductFilters()

const viewMode = ref<'grid' | 'list'>('grid')

const [{ data: rawCategories }, { data, pending, refresh }] = await Promise.all([
  listCategories({ limit: 20 }),
  listProducts({
    page: currentPage.value,
    limit: 24,
    categoryId: selectedCategory.value || undefined,
  }),
])

const categories = computed<Category[]>(() => rawCategories.value ?? [])
const products = computed<Product[]>(() => {
  const response = data.value as { data?: Product[] } | Product[] | null
  return (response && 'data' in response ? response.data : response) ?? []
})
const total = computed<number>(() => {
  const response = data.value as { total?: number } | null
  return (
    (response && 'total' in response ? response.total : products.value.length) ??
    products.value.length
  )
})
const totalPages = computed<number>(() => {
  const response = data.value as { totalPages?: number } | null
  return (response && 'totalPages' in response ? response.totalPages : 1) ?? 1
})

watch([currentPage, selectedCategory, selectedSort, selectedPrice], () => {
  refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const breadcrumbs = computed(() => {
  const items = [{ label: 'Home', to: '/' }, { label: 'Products' }]
  if (route.query.q) items.push({ label: `"${route.query.q}"` })
  return items
})

async function quickAdd(productId: string) {
  await addItem({ productId, quantity: 1 })
}
async function toggleWish(productId: string) {
  await addToWishlist(productId)
}

function onCategoryChange(val: string) {
  selectedCategory.value = val
  currentPage.value = 1
}
</script>

<template>
  <div class="products-page">
    <AppBreadcrumb :items="breadcrumbs" glass />

    <div class="products-page__layout">
      <ProductsFilters
        :categories="categories"
        :selected-category="selectedCategory"
        :selected-price="selectedPrice"
        :filter-open="filterOpen"
        :active-filters-count="activeFiltersCount"
        @update:selected-category="onCategoryChange"
        @update:selected-price="selectedPrice = $event"
        @update:filter-open="filterOpen = $event"
        @clear="clearFilters"
      />

      <main class="products-page__main" aria-label="Products listing">
        <ProductsResultsBar
          :total="total"
          :query="route.query.q as string"
          :view-mode="viewMode"
          :selected-sort="selectedSort"
          :active-filters-count="activeFiltersCount"
          @update:view-mode="viewMode = $event"
          @update:selected-sort="selectedSort = $event"
          @open-filters="filterOpen = true"
        />

        <ul
          v-if="pending"
          :class="viewMode === 'grid' ? 'products-page__grid' : 'products-page__list'"
          role="list"
          aria-label="Loading products"
          aria-busy="true"
        >
          <li v-for="i in 12" :key="i"><ProductSkeleton :variant="viewMode" /></li>
        </ul>

        <ul
          v-else-if="products.length > 0"
          :class="viewMode === 'grid' ? 'products-page__grid' : 'products-page__list'"
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

        <AppEmptyState
          v-else
          icon="search_off"
          title="No products found"
          body="Try adjusting your filters or search query."
        >
          <template #cta>
            <button type="button" class="products-page__empty-reset" @click="clearFilters">
              Clear all filters
            </button>
          </template>
        </AppEmptyState>

        <ProductsPagination
          v-if="totalPages > 1"
          :model-value="currentPage"
          :total-pages="totalPages"
          @update:model-value="currentPage = $event"
        />
      </main>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 1.5rem var(--container-pad) 4rem;
}

.products-page__layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

.products-page__main {
  flex: 1;
  min-width: 0;
}

.products-page__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.125rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (width >= 480px) {
  .products-page__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 900px) {
  .products-page__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 1200px) {
  .products-page__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.products-page__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.products-page__empty-reset {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity var(--transition-base);
}

.products-page__empty-reset:hover {
  opacity: 0.75;
}

.products-page__empty-reset:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
</style>
