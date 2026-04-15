<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'grid' | 'list'
  }>(),
  { variant: 'grid' }
)
</script>

<template>
  <!-- aria-hidden so screen readers skip loading placeholders -->
  <div class="skeleton" :class="`skeleton--${variant}`" aria-hidden="true" role="presentation">
    <div class="skeleton__image" />
    <div class="skeleton__body">
      <div class="skeleton__line skeleton__line--short" />
      <div class="skeleton__line skeleton__line--medium" />
      <div class="skeleton__line skeleton__line--price" />
    </div>
  </div>
</template>

<style scoped lang="scss" src="./styles/ProductSkeleton.scss"></style>
