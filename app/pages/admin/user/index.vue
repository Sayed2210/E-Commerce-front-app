<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()
useSeoMeta({ title: `${t('admin.customers')} — ${t('admin.panel')}` })
</script>

<template>
  <UsersList />
</template>
