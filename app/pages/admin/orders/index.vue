<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

useSeoMeta({ title: 'Orders — Admin' })
</script>

<template>
  <OrdersList />
</template>
