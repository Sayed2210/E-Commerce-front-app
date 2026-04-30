<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()
useSeoMeta({ title: `${t('admin.shipping')} — ${t('admin.panel')}` })

const activeTab = ref<'zones' | 'rates'>('zones')
</script>

<template>
  <div>
    <div class="shipping-tabs">
      <button
        type="button"
        class="shipping-tabs__btn"
        :class="{ 'shipping-tabs__btn--active': activeTab === 'zones' }"
        @click="activeTab = 'zones'"
      >
        {{ $t('admin.shipping.shippingZones') }}
      </button>
      <button
        type="button"
        class="shipping-tabs__btn"
        :class="{ 'shipping-tabs__btn--active': activeTab === 'rates' }"
        @click="activeTab = 'rates'"
      >
        {{ $t('admin.shipping.shippingRates') }}
      </button>
    </div>

    <ShippingZonesList v-if="activeTab === 'zones'" />
    <ShippingRatesList v-if="activeTab === 'rates'" />
  </div>
</template>

<style scoped>
.shipping-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.shipping-tabs__btn {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: -1px;
}

.shipping-tabs__btn:hover {
  color: var(--color-on-surface);
}

.shipping-tabs__btn--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
</style>
