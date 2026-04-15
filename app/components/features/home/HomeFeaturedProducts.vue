<script setup lang="ts">
import type { Product } from '~/types/api'

defineProps<{
  products: Product[]
  loading: boolean
}>()

defineEmits<{ 'add-to-cart': [productId: string] }>()
</script>

<template>
  <SectionHeader
    id="featured-heading"
    title="Featured Products"
    subtitle="Editor's picks for the season"
    link="/products"
  />

  <ul class="featured__grid" role="list" aria-label="Featured products">
    <template v-if="loading">
      <li v-for="i in 8" :key="i"><ProductSkeleton /></li>
    </template>
    <template v-else>
      <li v-for="product in products" :key="product.id">
        <ProductCard
          :product="product"
          :wishlist="true"
          @add-to-cart="$emit('add-to-cart', $event)"
        />
      </li>
    </template>
  </ul>

  <div v-if="!loading" class="featured__footer">
    <NuxtLink to="/products" class="featured__see-all">
      View all products
      <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.featured__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (width >= 480px) {
  .featured__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 768px) {
  .featured__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 1280px) {
  .featured__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.featured__footer {
  display: flex;
  justify-content: center;
  padding-top: 2.5rem;
}

.featured__see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-DEFAULT);
  border: 1px solid color-mix(in srgb, var(--color-outline) 25%, transparent);
  transition: all var(--transition-base);
}

.featured__see-all:hover {
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
  border-color: color-mix(in srgb, var(--color-outline) 50%, transparent);
  gap: 0.625rem;
}

.featured__see-all:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
