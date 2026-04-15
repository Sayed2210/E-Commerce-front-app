<script setup lang="ts">
interface Action {
  label: string
  icon: string
  to: string
}

const actions: Action[] = [
  {
    label: 'Add New Product',
    icon: 'add_box',
    to: '/admin/products/create',
  },
  {
    label: 'Manage Orders',
    icon: 'assignment',
    to: '/admin/orders',
  },
  {
    label: 'View Customers',
    icon: 'group',
    to: '/admin/users',
  },
  {
    label: 'Create Coupon',
    icon: 'local_offer',
    to: '/admin/coupons',
  },
]
</script>

<template>
  <div class="bg-surface-container-lowest rounded shadow-sm p-6">
    <h3 class="font-bold text-on-surface font-headline mb-4">Quick Actions</h3>
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
