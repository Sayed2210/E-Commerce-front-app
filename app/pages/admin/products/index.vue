<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

useSeoMeta({ title: 'Inventory — Admin' })
</script>

<template>
  <ProductsList />
</template>
