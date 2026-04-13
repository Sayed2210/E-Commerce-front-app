<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 mb-6 text-xs uppercase tracking-widest text-secondary">
      <NuxtLink to="/" class="hover:text-primary transition-colors">Home</NuxtLink>
      <span class="material-symbols-outlined text-[10px]">chevron_right</span>
      <span class="text-on-surface">Products</span>
      <span v-if="route.query.q" class="text-on-surface">— "{{ route.query.q }}"</span>
    </nav>

    <div class="flex gap-8">
      <!-- Sidebar Filters -->
      <aside class="w-56 shrink-0 hidden md:block space-y-8">
        <!-- Category -->
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-on-surface mb-3">Department</h3>
          <ul class="space-y-1.5">
            <li v-for="cat in categories" :key="cat.slug">
              <button
                @click="toggleCategory(cat.slug)"
                :class="selectedCategory === cat.slug ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'"
                class="text-sm transition-colors text-left w-full"
              >{{ cat.label }}</button>
            </li>
          </ul>
        </div>

        <!-- Price range -->
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-on-surface mb-3">Price Range</h3>
          <div class="space-y-2">
            <div v-for="range in priceRanges" :key="range.label">
              <label class="flex items-center gap-2 text-sm text-secondary hover:text-on-surface cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  :value="range.value"
                  v-model="selectedPrice"
                  class="accent-primary-container"
                />
                {{ range.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Sort -->
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-on-surface mb-3">Sort By</h3>
          <select
            v-model="selectedSort"
            class="w-full bg-surface-container-low border-none rounded text-sm py-2 px-3 focus:ring-1 focus:ring-primary outline-none text-on-surface"
          >
            <option value="">Most Relevant</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <button
          @click="clearFilters"
          class="w-full text-xs text-secondary hover:text-primary transition-colors text-left"
        >Clear all filters</button>
      </aside>

      <!-- Main content -->
      <section class="flex-1">
        <!-- Results bar -->
        <div class="flex items-center justify-between mb-6 border-b border-outline-variant/15 pb-4">
          <div>
            <h1 class="text-2xl font-bold text-on-surface font-headline">
              {{ route.query.q ? `Results for "${route.query.q}"` : 'All Products' }}
            </h1>
            <p class="text-secondary text-xs mt-0.5">{{ total }} items found</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'text-primary' : 'text-secondary'"
              class="p-1.5 hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined text-xl">grid_view</span>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'text-primary' : 'text-secondary'"
              class="p-1.5 hover:text-primary transition-colors"
            >
              <span class="material-symbols-outlined text-xl">view_list</span>
            </button>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-if="pending" :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'">
          <div v-for="i in 12" :key="i" class="bg-surface-container-lowest rounded animate-pulse">
            <div class="aspect-square bg-surface-container-low rounded mb-4"></div>
            <div class="p-4 space-y-2">
              <div class="h-3 bg-surface-container-low rounded w-3/4"></div>
              <div class="h-4 bg-surface-container-low rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Grid view -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="group bg-surface-container-lowest rounded shadow-sm hover:shadow-ambient hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
          >
            <div class="aspect-square relative overflow-hidden bg-surface-container-low">
              <img
                v-if="product.images?.[0]"
                :src="product.images[0]"
                :alt="productName(product)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-5xl text-secondary/30">image</span>
              </div>
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <button @click.prevent="toggleWish(product.id)" class="w-8 h-8 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-ambient text-secondary hover:text-primary transition-colors">
                  <span class="material-symbols-outlined text-sm">favorite_border</span>
                </button>
              </div>
            </div>
            <div class="p-4 flex flex-col flex-1">
              <p class="text-secondary text-xs mb-1">{{ product.brand?.name ?? '' }}</p>
              <h3 class="font-bold text-sm text-on-surface leading-tight mb-2 line-clamp-2 flex-1">{{ productName(product) }}</h3>
              <div class="flex items-center gap-1 mb-3">
                <span
                  v-for="s in 5" :key="s"
                  class="material-symbols-outlined text-[10px]"
                  :class="s <= Math.round(product.averageRating ?? 0) ? 'text-primary-container' : 'text-outline-variant'"
                  :style="s <= Math.round(product.averageRating ?? 0) ? `font-variation-settings: 'FILL' 1` : ''"
                >star</span>
                <span class="text-[10px] text-secondary ml-1">{{ product.reviewCount ?? 0 }}</span>
              </div>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-primary font-bold text-lg">${{ product.basePrice.toFixed(2) }}</span>
                <button
                  @click.prevent="quickAdd(product.id)"
                  class="bg-surface-container-low text-primary px-3 py-1.5 rounded text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- List view -->
        <div v-else class="space-y-4">
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="group bg-surface-container-lowest rounded flex gap-6 p-4 hover:shadow-ambient transition-all"
          >
            <div class="w-32 h-32 shrink-0 bg-surface-container-low rounded overflow-hidden">
              <img
                v-if="product.images?.[0]"
                :src="product.images[0]"
                :alt="productName(product)"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex flex-col justify-between flex-1">
              <div>
                <p class="text-secondary text-xs mb-0.5">{{ product.brand?.name ?? '' }}</p>
                <h3 class="font-bold text-on-surface mb-1">{{ productName(product) }}</h3>
                <div class="flex items-center gap-1">
                  <span v-for="s in 5" :key="s" class="material-symbols-outlined text-[10px]"
                    :class="s <= Math.round(product.averageRating ?? 0) ? 'text-primary-container' : 'text-outline-variant'"
                    :style="s <= Math.round(product.averageRating ?? 0) ? `font-variation-settings: 'FILL' 1` : ''">star</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-primary font-bold text-xl">${{ product.basePrice.toFixed(2) }}</span>
                <button @click.prevent="quickAdd(product.id)" class="bg-primary-container text-on-primary-container px-4 py-2 rounded text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all">
                  Add to Cart
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-if="!pending && products.length === 0" class="text-center py-24">
          <span class="material-symbols-outlined text-6xl text-secondary/30 mb-4 block">search_off</span>
          <h3 class="font-bold text-on-surface mb-2">No products found</h3>
          <p class="text-secondary text-sm">Try adjusting your filters or search query.</p>
          <button @click="clearFilters" class="mt-4 text-primary text-sm font-semibold hover:underline">Clear filters</button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
          <button
            v-for="p in totalPages"
            :key="p"
            @click="currentPage = p"
            :class="currentPage === p ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-lowest text-secondary hover:bg-surface-container-low'"
            class="w-9 h-9 rounded text-sm transition-colors"
          >{{ p }}</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/api'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { listProducts } = useProducts()
const { addItem } = useCart()
const { addToWishlist } = useWishlist()

const viewMode      = ref<'grid' | 'list'>('grid')
const currentPage   = ref(1)
const selectedCategory = ref(route.query.category as string ?? '')
const selectedPrice = ref('')
const selectedSort  = ref('')

const priceRanges = [
  { label: 'Under $25',      value: '0-25'      },
  { label: '$25 – $100',     value: '25-100'    },
  { label: '$100 – $500',    value: '100-500'   },
  { label: 'Over $500',      value: '500-99999' },
]

const categories = [
  { slug: 'electronics', label: 'Electronics' },
  { slug: 'home',        label: 'Home & Garden'},
  { slug: 'fashion',     label: 'Fashion'     },
  { slug: 'industrial',  label: 'Industrial'  },
  { slug: 'books',       label: 'Books'       },
  { slug: 'sports',      label: 'Sports'      },
  { slug: 'toys',        label: 'Toys'        },
  { slug: 'health',      label: 'Health'      },
]

const queryParams = computed(() => ({
  page:       currentPage.value,
  limit:      20,
  categoryId: selectedCategory.value || undefined,
  sort:       selectedSort.value || undefined,
  minPrice:   selectedPrice.value ? Number(selectedPrice.value.split('-')[0]) : undefined,
  maxPrice:   selectedPrice.value ? Number(selectedPrice.value.split('-')[1]) : undefined,
}))

const { data, pending, refresh } = await listProducts(queryParams.value)
watch([currentPage, selectedCategory, selectedSort, selectedPrice], () => refresh())

const products    = computed<Product[]>(() => (data.value as any)?.data ?? (data.value as any) ?? [])
const total       = computed<number>(() => (data.value as any)?.total ?? products.value.length)
const totalPages  = computed<number>(() => (data.value as any)?.totalPages ?? 1)

function productName(p: Product) {
  return typeof p.name === 'string' ? p.name : p.name?.en ?? ''
}
function toggleCategory(slug: string) {
  selectedCategory.value = selectedCategory.value === slug ? '' : slug
  currentPage.value = 1
}
function clearFilters() {
  selectedCategory.value = ''
  selectedPrice.value    = ''
  selectedSort.value     = ''
  currentPage.value      = 1
}
async function quickAdd(productId: string) {
  await addItem({ productId, quantity: 1 })
}
async function toggleWish(productId: string) {
  await addToWishlist(productId)
}

useSeoMeta({ title: 'Products — ArchitectMarket' })
</script>
