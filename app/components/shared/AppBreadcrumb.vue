<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string
}

withDefaults(
  defineProps<{
    items: BreadcrumbItem[]
    glass?: boolean
  }>(),
  { glass: false }
)
</script>

<template>
  <nav class="breadcrumb" :class="{ 'breadcrumb--glass': glass }" aria-label="Breadcrumb">
    <template v-for="(item, i) in items" :key="i">
      <NuxtLink v-if="item.to" :to="item.to" class="breadcrumb__item">{{ item.label }}</NuxtLink>
      <span
        v-else
        class="breadcrumb__item breadcrumb__item--current"
        :aria-current="i === items.length - 1 ? 'page' : undefined"
        >{{ item.label }}</span
      >
      <span
        v-if="i < items.length - 1"
        class="material-symbols-outlined breadcrumb__sep"
        aria-hidden="true"
        >chevron_right</span
      >
    </template>
  </nav>
</template>

<style scoped lang="scss">
@use 'abstracts' as *;

.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1.75rem;

  &--glass {
    background: color-mix(in srgb, var(--color-surface-container-lowest) 75%, transparent);
    backdrop-filter: blur(12px);
    border: 1px solid color-mix(in srgb, var(--color-outline-variant) 20%, transparent);
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-full);
  }
}

.breadcrumb__item {
  @include label-xs(0.07em);

  font-size: 0.7rem;
  color: var(--color-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);

  &:is(a):hover {
    color: var(--color-primary);
  }

  &:is(a) {
    @include focus-ring(var(--color-primary), 2px, var(--radius-sm));
  }

  &--current {
    color: var(--color-on-surface);
  }
}

.breadcrumb__sep {
  font-size: 0.75rem;
  color: var(--color-outline-variant);
}
</style>
