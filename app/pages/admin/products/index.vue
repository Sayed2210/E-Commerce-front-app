<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()
useSeoMeta({ title: `${t('admin.inventory')} — ${t('admin.panel')}` })
</script>

<template>
  <ProductsList />
</template>
