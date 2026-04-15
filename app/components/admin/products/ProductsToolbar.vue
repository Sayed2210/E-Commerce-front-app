<script setup lang="ts">
interface Props {
  search: string
  statusFilter: string
  loading?: boolean
}

const emit = defineEmits<{
  'update:search': [value: string]
  'update:statusFilter': [value: string]
}>()

withDefaults(defineProps<Props>(), {
  loading: false,
})

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]
</script>

<template>
  <div class="flex gap-3">
    <div class="relative flex-1 max-w-xs">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm"
        >search</span
      >
      <input
        :value="search"
        type="text"
        placeholder="Search products…"
        class="w-full bg-surface-container-lowest border border-outline-variant/20 rounded pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
        :disabled="loading"
        aria-label="Search products"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <select
      :value="statusFilter"
      class="bg-surface-container-lowest border border-outline-variant/20 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-on-surface"
      :disabled="loading"
      aria-label="Filter by status"
      @change="emit('update:statusFilter', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
/* Toolbar styles */
</style>
