<template>
  <div>
    <!-- Hero Banner -->
    <section class="relative overflow-hidden bg-on-surface" style="aspect-ratio: 25/8; min-height: 200px;">
      <div class="absolute inset-0 bg-gradient-to-r from-on-surface via-on-surface/60 to-transparent z-10 flex items-center">
        <div class="pl-12 md:pl-20 max-w-2xl">
          <span class="inline-block bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Seasonal Event
          </span>
          <h1 class="text-5xl md:text-7xl font-extrabold text-surface-container-lowest leading-none tracking-tighter mb-6 uppercase italic font-headline">
            Summer Sale
          </h1>
          <p class="text-surface-container-high text-lg mb-8 font-light max-w-md">
            Precision-engineered essentials for the modern lifestyle. Save up to 40% on select items.
          </p>
          <NuxtLink
            to="/products"
            class="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-8 py-3 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all group"
          >
            Shop Now
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-6">
      <!-- Categories grid -->
      <section class="py-12">
        <div class="flex items-end justify-between mb-8">
          <h2 class="text-3xl font-bold tracking-tight text-on-surface font-headline">Shop by Category</h2>
          <NuxtLink to="/products" class="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View all <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/products?category=${cat.slug}`"
            class="group cursor-pointer"
          >
            <div class="aspect-square bg-surface-container-lowest rounded flex flex-col items-center justify-center p-4 transition-all group-hover:shadow-ambient group-hover:-translate-y-0.5">
              <span class="material-symbols-outlined text-4xl text-primary mb-3">{{ cat.icon }}</span>
              <span class="text-xs font-bold text-on-surface text-center group-hover:text-primary transition-colors">{{ cat.label }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Featured products -->
      <section class="pb-12">
        <div class="flex items-end justify-between mb-8">
          <h2 class="text-3xl font-bold tracking-tight text-on-surface font-headline">Featured Products</h2>
          <NuxtLink to="/products" class="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View all <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>

        <!-- Skeleton -->
        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-surface-container-lowest rounded animate-pulse">
            <div class="aspect-square bg-surface-container-low rounded mb-4"></div>
            <div class="p-4 space-y-2">
              <div class="h-3 bg-surface-container-low rounded w-3/4"></div>
              <div class="h-4 bg-surface-container-low rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="product in products"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="bg-surface-container-lowest rounded p-3 group relative hover:shadow-ambient transition-all border border-transparent hover:border-outline-variant/10 flex flex-col"
          >
            <span
              v-if="product.inventoryQuantity < 10"
              class="absolute top-4 left-4 z-10 bg-error-container text-on-error-container text-[10px] font-black px-2 py-0.5 rounded-full uppercase"
            >Low Stock</span>
            <div class="aspect-square bg-surface-container-low rounded overflow-hidden mb-4">
              <img
                v-if="product.images?.[0]"
                :src="product.images[0]"
                :alt="productName(product)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-5xl text-secondary/30">image</span>
              </div>
            </div>
            <div class="mt-auto">
              <p class="text-secondary text-xs mb-1">{{ product.brand?.name ?? '' }}</p>
              <h3 class="font-bold text-sm text-on-surface leading-tight mb-2 line-clamp-2">{{ productName(product) }}</h3>
              <div class="flex items-center gap-1 mb-2">
                <span
                  v-for="s in 5" :key="s"
                  class="material-symbols-outlined text-[10px]"
                  :class="s <= Math.round(product.averageRating ?? 0) ? 'text-primary-container' : 'text-outline-variant'"
                  :style="s <= Math.round(product.averageRating ?? 0) ? `font-variation-settings: 'FILL' 1` : ''"
                >star</span>
                <span class="text-[10px] text-secondary font-bold ml-1">{{ product.reviewCount ?? 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-primary font-bold text-lg">${{ product.basePrice.toFixed(2) }}</span>
                <button
                  @click.prevent="quickAddToCart(product.id)"
                  class="bg-surface-container-low text-primary p-2 rounded hover:bg-primary-container hover:text-on-primary-container transition-all"
                  title="Add to cart"
                >
                  <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Newsletter banner -->
      <section class="bg-on-surface rounded-xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div class="absolute inset-0 opacity-10 bg-gradient-to-r from-primary-container to-transparent pointer-events-none"></div>
        <div class="relative z-10 max-w-lg">
          <h2 class="text-3xl font-extrabold text-surface-container-lowest mb-2 uppercase italic tracking-tight font-headline">
            Free Shipping Over $99
          </h2>
          <p class="text-surface-container-high text-sm">Use code <span class="font-bold text-primary-container">FREESHIP</span> at checkout.</p>
        </div>
        <div class="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email for deals"
            class="bg-transparent border border-surface-container/20 text-surface-container-lowest text-sm px-6 py-3 rounded min-w-[280px] focus:ring-1 focus:ring-primary-container outline-none placeholder:text-surface-container-high"
          />
          <button class="bg-primary text-on-primary font-bold px-8 py-3 rounded text-sm hover:bg-primary-container hover:text-on-primary-container transition-all whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/api'

definePageMeta({ layout: 'default' })

const { listProducts } = useProducts()
const { addItem } = useCart()
const email = ref('')

const { data, pending } = await listProducts({ limit: 8 })
const products = computed<Product[]>(() => {
  const d = data.value as any
  return d?.data ?? d ?? []
})

const categories = [
  { slug: 'electronics', label: 'Electronics', icon: 'laptop_mac'    },
  { slug: 'home',        label: 'Home',        icon: 'home'          },
  { slug: 'fashion',     label: 'Fashion',     icon: 'checkroom'     },
  { slug: 'industrial',  label: 'Industrial',  icon: 'construction'  },
  { slug: 'books',       label: 'Books',       icon: 'auto_stories'  },
  { slug: 'sports',      label: 'Sports',      icon: 'fitness_center'},
  { slug: 'toys',        label: 'Toys',        icon: 'toys'          },
  { slug: 'health',      label: 'Health',      icon: 'local_pharmacy'},
]

function productName(product: Product): string {
  const n = product.name
  return typeof n === 'string' ? n : (n?.en ?? '')
}

async function quickAddToCart(productId: string) {
  await addItem({ productId, quantity: 1 })
}

useSeoMeta({ title: 'ArchitectMarket — Precision Tools Marketplace' })
</script>
