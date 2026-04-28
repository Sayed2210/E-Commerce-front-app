<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()
useSeoMeta({ title: `${t('admin.returns')} — ${t('admin.panel')}` })
</script>

<template>
  <ReturnsList />
</template>
