<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()
useSeoMeta({ title: `${t('admin.currencies')} — ${t('admin.panel')}` })
</script>

<template>
  <CurrenciesList />
</template>
