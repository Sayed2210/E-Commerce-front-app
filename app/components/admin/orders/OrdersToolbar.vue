<script setup lang="ts">
interface Props {
  search: string
  statusFilter: string
  statuses: string[]
  loading?: boolean
}

const emit = defineEmits<{
  'update:search': [value: string]
  'update:statusFilter': [value: string]
  export: []
}>()

withDefaults(defineProps<Props>(), {
  loading: false,
})
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
        placeholder="Search by ID or customer…"
        class="w-full bg-surface-container-lowest border border-outline-variant/20 rounded pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
        :disabled="loading"
        aria-label="Search orders"
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
      <option value="">All Statuses</option>
      <option v-for="s in statuses" :key="s" :value="s" class="capitalize">
        {{ s }}
      </option>
    </select>
    <button
      type="button"
      class="bg-primary-container text-on-primary-container px-4 py-2 text-xs font-bold rounded flex items-center gap-2 hover:brightness-95 transition-all"
      :disabled="loading"
      @click="emit('export')"
    >
      <span class="material-symbols-outlined text-sm">download</span>
      Export
    </button>
  </div>
</template>

<style scoped>
/* Toolbar styles */
</style>
