<script setup lang="ts">
interface StatusItem {
  status: string
  count: number
  color: string
}

interface Props {
  statuses: StatusItem[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<template>
  <div class="bg-surface-container-lowest rounded shadow-sm p-6">
    <h3 class="font-bold text-on-surface font-headline mb-4">Order Status</h3>
    <div class="space-y-3">
      <div v-for="s in statuses" :key="s.status" class="flex items-center gap-3">
        <div class="w-2 h-2 rounded-full shrink-0" :class="s.color"></div>
        <span class="text-xs text-secondary flex-1 capitalize">{{ s.status }}</span>
        <span class="text-xs font-bold text-on-surface">
          {{ loading ? '—' : s.count }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Order status breakdown styles */
</style>
