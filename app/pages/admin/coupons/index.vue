<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Coupons — Admin' })
</script>

<template>
  <CouponsList />
</template>
