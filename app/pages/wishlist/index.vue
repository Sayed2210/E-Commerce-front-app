<script setup lang="ts">
import type { WishlistItem, Product } from '~/types/api'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { getWishlist, removeFromWishlist, clearWishlist } = useWishlist()
const { addItem } = useCart()

const { data, pending, refresh } = await getWishlist()
const items = computed<WishlistItem[]>(() => (data.value as any) ?? [])

function productName(p: Product | undefined) {
  if (!p) return 'Product'
  return typeof p.name === 'string' ? p.name : (p.name?.en ?? '')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

async function removeItem(productId: string) {
  await removeFromWishlist(productId)
  await refresh()
}

async function clearAll() {
  await clearWishlist()
  await refresh()
}

async function moveToCart(item: WishlistItem) {
  await addItem({ productId: item.productId, quantity: 1 })
  await removeFromWishlist(item.productId)
  await refresh()
}

useSeoMeta({ title: 'My Wishlist — ArchitectMarket' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-on-surface font-headline">My Wishlist</h1>
        <p class="text-secondary text-sm mt-1">
          {{ items.length }} saved item{{ items.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <button
        v-if="items.length"
        type="button"
        class="text-xs text-secondary hover:text-error transition-colors flex items-center gap-1"
        @click="clearAll"
      >
        <span class="material-symbols-outlined text-sm">delete_sweep</span>
        Clear all
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-surface-container-lowest rounded animate-pulse">
        <div class="aspect-square bg-surface-container-low rounded mb-4"></div>
        <div class="p-4 space-y-2">
          <div class="h-3 bg-surface-container-low rounded w-3/4"></div>
          <div class="h-4 bg-surface-container-low rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Wishlist grid -->
    <div v-else-if="items.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-surface-container-lowest rounded overflow-hidden group hover:shadow-ambient transition-all flex flex-col"
      >
        <!-- Image -->
        <div class="aspect-square relative bg-surface-container-low overflow-hidden">
          <NuxtLink :to="`/products/${item.productId}`">
            <img
              v-if="item.product?.images?.[0]"
              :src="item.product.images[0]"
              :alt="productName(item.product)"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="material-symbols-outlined text-5xl text-secondary/30">image</span>
            </div>
          </NuxtLink>
          <button
            type="button"
            class="absolute top-3 right-3 w-8 h-8 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-ambient text-error hover:bg-error-container transition-colors opacity-0 group-hover:opacity-100"
            @click="removeItem(item.productId)"
          >
            <span
              class="material-symbols-outlined text-sm"
              style="font-variation-settings: 'FILL' 1"
              >favorite</span
            >
          </button>
        </div>

        <!-- Info -->
        <div class="p-4 flex flex-col flex-1">
          <p class="text-secondary text-xs mb-0.5">{{ item.product?.brand?.name ?? '' }}</p>
          <NuxtLink
            :to="`/products/${item.productId}`"
            class="font-bold text-sm text-on-surface leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors flex-1"
          >
            {{ productName(item.product) }}
          </NuxtLink>
          <div class="flex items-center gap-1 mb-3">
            <span
              v-for="s in 5"
              :key="s"
              class="material-symbols-outlined text-[10px]"
              :class="
                s <= Math.round(item.product?.averageRating ?? 0)
                  ? 'text-primary-container'
                  : 'text-outline-variant'
              "
              :style="
                s <= Math.round(item.product?.averageRating ?? 0)
                  ? `font-variation-settings: 'FILL' 1`
                  : ''
              "
              >star</span
            >
            <span class="text-[10px] text-secondary ml-1">{{
              item.product?.reviewCount ?? 0
            }}</span>
          </div>
          <div class="flex items-center justify-between mt-auto">
            <span class="text-primary font-bold text-lg"
              >${{ item.product?.basePrice?.toFixed(2) ?? '—' }}</span
            >
            <button
              type="button"
              class="bg-surface-container-low text-primary px-3 py-1.5 rounded text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1"
              @click="moveToCart(item)"
            >
              <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
              Add to Cart
            </button>
          </div>
        </div>

        <!-- Added date -->
        <div class="px-4 pb-3 text-[10px] text-secondary">Saved {{ formatDate(item.addedAt) }}</div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-24">
      <span
        class="material-symbols-outlined text-7xl text-secondary/20 block mb-4"
        style="font-variation-settings: 'FILL' 0"
        >favorite_border</span
      >
      <h2 class="text-2xl font-bold text-on-surface font-headline mb-2">Your wishlist is empty</h2>
      <p class="text-secondary text-sm mb-6">Save items you love to buy them later.</p>
      <NuxtLink
        to="/products"
        class="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all"
      >
        Explore Products
      </NuxtLink>
    </div>
  </div>
</template>
