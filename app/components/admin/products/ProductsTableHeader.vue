<script setup lang="ts">
const headers = [
  { label: 'Product', hiddenOn: '' },
  { label: 'Category', hiddenOn: '' },
  { label: 'Price', hiddenOn: '' },
  { label: 'Stock', hiddenOn: '' },
  { label: 'Status', hiddenOn: '' },
  { label: 'Actions', hiddenOn: '' },
]
</script>

<template>
  <thead class="bg-surface-container-low">
    <tr>
      <th
        v-for="header in headers"
        :key="header.label"
        :class="header.hiddenOn"
        class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-secondary"
      >
        {{ header.label }}
      </th>
    </tr>
  </thead>
</template>

<style scoped>
/* Table header styles */
</style>
