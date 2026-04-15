<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 8,
  columns: 6,
})

const skeletonRows = computed(() => Array.from({ length: props.rows }, (_, i) => i))
const skeletonCols = computed(() => Array.from({ length: props.columns }, (_, i) => i))
</script>

<template>
  <tbody class="divide-y divide-outline-variant/10">
    <tr
      v-for="row in skeletonRows"
      :key="row"
      class="border-t border-outline-variant/10 animate-pulse"
    >
      <td v-for="col in skeletonCols" :key="col" class="px-6 py-4">
        <div class="h-4 bg-surface-container-low rounded w-full"></div>
      </td>
    </tr>
  </tbody>
</template>

<style scoped>
/* Skeleton loader shared styles */
</style>
