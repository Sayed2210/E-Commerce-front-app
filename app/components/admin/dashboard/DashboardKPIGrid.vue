<script setup lang="ts">
interface KPICard {
  label: string
  value: string | number
  icon: string
  iconBg: string
  iconColor: string
  trend?: number | null
}

interface Props {
  kpis: KPICard[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <DashboardKPICard
      v-for="kpi in kpis"
      :key="kpi.label"
      :label="kpi.label"
      :value="kpi.value"
      :icon="kpi.icon"
      :icon-bg="kpi.iconBg"
      :icon-color="kpi.iconColor"
      :trend="kpi.trend"
      :loading="loading"
    />
  </div>
</template>

<style scoped>
/* KPI grid styles */
</style>
