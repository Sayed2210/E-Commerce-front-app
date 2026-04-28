<script setup lang="ts">
interface Action {
  label: string
  icon: string
  to: string
}

const { t } = useI18n()

const actions: Action[] = [
  {
    label: t('admin.dashboardPage.addNewProduct'),
    icon: 'add_box',
    to: '/admin/products/create',
  },
  {
    label: t('admin.dashboardPage.manageOrders'),
    icon: 'assignment',
    to: '/admin/orders',
  },
  {
    label: t('admin.dashboardPage.viewCustomers'),
    icon: 'group',
    to: '/admin/users',
  },
  {
    label: t('admin.dashboardPage.createCoupon'),
    icon: 'local_offer',
    to: '/admin/coupons',
  },
]
</script>

<template>
  <div class="bg-surface-container-lowest rounded shadow-sm p-6">
    <h3 class="font-bold text-on-surface font-headline mb-4">
      {{ $t('admin.dashboardPage.quickActions') }}
    </h3>
    <div class="space-y-2">
      <NuxtLink
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        class="flex items-center gap-3 text-sm text-secondary hover:text-primary transition-colors py-1"
      >
        <span class="material-symbols-outlined text-xl text-primary-container">{{
          action.icon
        }}</span>
        {{ action.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* Quick actions styles */
</style>
