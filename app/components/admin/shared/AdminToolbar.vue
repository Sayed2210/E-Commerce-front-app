<script setup lang="ts">
interface Props {
  search?: string
  searchPlaceholder?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  search: '',
  searchPlaceholder: 'Search...',
  loading: false,
})

const emit = defineEmits<{
  'update:search': [value: string]
}>()
</script>

<template>
  <div class="flex gap-3">
    <div class="relative flex-1 max-w-sm">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm"
        >search</span
      >
      <input
        :value="search"
        type="text"
        :placeholder="searchPlaceholder"
        class="w-full bg-surface-container-lowest border border-outline-variant/20 rounded pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
        :disabled="loading"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <slot />
  </div>
</template>

<style scoped>
/* Admin toolbar styles */
</style>
