<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  icon: string
  iconBg: string
  iconColor: string
  trend?: number | null
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  trend: null,
  loading: false,
})

const trendDirection = computed(() => {
  const t = useAttrs().trend as number | null | undefined
  if (!t) return null
  return t > 0 ? 'up' : 'down'
})
</script>

<template>
  <div
    class="bg-surface-container-lowest p-6 rounded shadow-sm hover:shadow-ambient transition-all border-b-2 border-transparent hover:border-primary-container"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="p-2 rounded-sm" :class="iconBg">
        <span class="material-symbols-outlined" :class="iconColor">{{ icon }}</span>
      </div>
      <div
        v-if="trend"
        class="flex items-center text-xs font-bold"
        :class="trend > 0 ? 'text-green-600' : 'text-error'"
      >
        <span class="material-symbols-outlined text-sm">{{
          trendDirection === 'up' ? 'trending_up' : 'trending_down'
        }}</span>
        {{ Math.abs(trend) }}%
      </div>
    </div>
    <p class="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
      {{ label }}
    </p>
    <p class="text-2xl font-bold font-headline text-on-surface">
      {{ loading ? '—' : value }}
    </p>
  </div>
</template>

<style scoped>
/* KPI card styles */
</style>
