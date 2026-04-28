<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()
useSeoMeta({ title: `${t('admin.newsletter')} — ${t('admin.panel')}` })
</script>

<template>
  <NewsletterList />
</template>
