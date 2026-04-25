<script setup lang="ts">
interface Props {
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<template>
  <td class="px-6 py-4">
    <div class="flex items-center gap-2">
      <slot />
    </div>
  </td>
</template>

<style scoped>
/* Admin table actions styles */
</style>
