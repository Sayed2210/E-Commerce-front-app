<script setup lang="ts">
interface Props {
  title: string
  description?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<template>
  <div class="flex justify-between items-end">
    <div>
      <h2 class="text-2xl font-bold font-headline text-on-surface">{{ title }}</h2>
      <p v-if="description" class="text-secondary text-sm">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
/* Admin page header styles */
</style>
