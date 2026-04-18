<script setup lang="ts">
import type { Category } from '~/types/api'

defineProps<{ categories: Category[] }>()

const { categoryIcon } = useCategories()
</script>

<template>
  <ul class="cats-grid" role="list" aria-label="Product categories">
    <li v-for="cat in categories" :key="cat.slug">
      <NuxtLink :to="`/products?category=${cat.slug}`" class="cat-card">
        <span class="cat-card__icon material-symbols-outlined" aria-hidden="true">
          {{ categoryIcon(cat.slug) }}
        </span>
        <span class="cat-card__name">{{ cat.name }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">
@use 'abstracts' as *;

.cats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (width >= 480px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (width >= 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(8, 1fr);
  }
}

.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem 0.5rem;
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition:
    box-shadow var(--transition-base),
    transform var(--transition-base);

  @include focus-ring;

  &:hover {
    box-shadow: var(--shadow-card);
    transform: translateY(-2px);

    .cat-card__icon {
      transform: scale(1.1);
    }

    .cat-card__name {
      color: var(--color-primary);
    }
  }
}

.cat-card__icon {
  font-size: 1.75rem;
  color: var(--color-primary);
  transition: transform var(--transition-base);
}

.cat-card__name {
  @include label-xs(0.04em);

  font-size: 0.7rem;
  color: var(--color-on-surface);
  text-align: center;
  transition: color var(--transition-fast);
}
</style>
