<script setup lang="ts">
import type { Product, Category } from '~/types/api'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'ArchitectMarket — Precision Tools Marketplace' })

const { listProducts } = useProducts()
const { listCategories } = useCategories()
const { addItem } = useCart()

const [{ data: productsData, pending }, { data: rawCategories }] = await Promise.all([
  listProducts({ limit: 8 }),
  listCategories({ limit: 8 }),
])

const products = computed<Product[]>(() => {
  const d = productsData.value as any
  return d?.data ?? d ?? []
})

const categories = computed<Category[]>(() => rawCategories.value ?? [])

async function quickAddToCart(productId: string) {
  await addItem({ productId, quantity: 1 })
}
</script>

<template>
  <div>
    <HomeHero />

    <section class="section" aria-labelledby="cats-heading">
      <SectionHeader
        id="cats-heading"
        title="Shop by Category"
        subtitle="Explore our curated collections"
        link="/products"
      />
      <HomeCategoryGrid :categories="categories" />
    </section>

    <section class="section section--tinted" aria-labelledby="featured-heading">
      <div class="section__inner">
        <HomeFeaturedProducts
          :products="products"
          :loading="pending"
          @add-to-cart="quickAddToCart"
        />
      </div>
    </section>

    <HomePerksStrip />
    <HomeNewsletter />
  </div>
</template>

<style scoped>
.section {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 4rem var(--container-pad);
}

.section--tinted {
  max-width: 100%;
  background: var(--color-surface-container-low);
  padding-inline: 0;
}

.section__inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 4rem var(--container-pad);
}
</style>
