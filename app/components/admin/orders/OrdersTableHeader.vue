<script setup lang="ts">
const { t } = useI18n()

const headers = [
  { label: t('admin.ordersPage.orderId'), hiddenOn: '' },
  { label: t('admin.ordersPage.customer'), hiddenOn: 'hidden md:table-cell' },
  { label: t('admin.ordersPage.date'), hiddenOn: 'hidden lg:table-cell' },
  { label: t('admin.ordersPage.payment'), hiddenOn: 'hidden lg:table-cell' },
  { label: t('admin.ordersPage.total'), hiddenOn: '' },
  { label: t('admin.ordersPage.status'), hiddenOn: '' },
  { label: t('admin.ordersPage.actions'), hiddenOn: '' },
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
