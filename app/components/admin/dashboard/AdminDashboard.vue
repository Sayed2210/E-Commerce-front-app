<script setup lang="ts">
import { useDashboardStats } from '~/composables/admin/useDashboardStats'

const { kpis, recentOrders, orderStatuses, pending } = useDashboardStats()
</script>

<template>
  <div class="space-y-8">
    <!-- Title -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-2xl font-bold font-headline tracking-tight text-on-surface">
          Dashboard Overview
        </h2>
        <p class="text-secondary text-sm">Real-time performance metrics for ArchitectMarket</p>
      </div>
    </div>

    <!-- KPI Cards Grid -->
    <AdminDashboardKPIGrid :kpis="kpis" :loading="pending" />

    <!-- Two-column layout: Recent Orders + Status -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <AdminDashboardRecentOrders :orders="recentOrders" :loading="pending" />

      <!-- Status Breakdown + Quick Actions -->
      <div class="space-y-4">
        <AdminDashboardOrderStatus :statuses="orderStatuses" :loading="pending" />
        <AdminDashboardQuickActions />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Dashboard page styles */
</style>
