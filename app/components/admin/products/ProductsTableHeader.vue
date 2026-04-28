<script setup lang="ts">
const { t } = useI18n()

const headers = [
  { label: t('admin.productsPage.product'), hiddenOn: '' },
  { label: t('admin.productsPage.category'), hiddenOn: '' },
  { label: t('admin.productsPage.price'), hiddenOn: '' },
  { label: t('admin.productsPage.stock'), hiddenOn: '' },
  { label: t('admin.productsPage.status'), hiddenOn: '' },
  { label: t('admin.productsPage.actions'), hiddenOn: '' },
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
