<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

useSeoMeta({ title: 'Categories — Admin' })
</script>

<template>
  <CategoriesList />
</template>
