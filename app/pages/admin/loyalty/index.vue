<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useI18n()
useSeoMeta({ title: `${t('admin.loyalty')} — ${t('admin.panel')}` })

const activeTab = ref<'rules' | 'redemptions'>('rules')
</script>

<template>
  <div>
    <div class="loyalty-tabs">
      <button
        type="button"
        class="loyalty-tabs__btn"
        :class="{ 'loyalty-tabs__btn--active': activeTab === 'rules' }"
        @click="activeTab = 'rules'"
      >
        {{ $t('admin.loyalty.earningRules') }}
      </button>
      <button
        type="button"
        class="loyalty-tabs__btn"
        :class="{ 'loyalty-tabs__btn--active': activeTab === 'redemptions' }"
        @click="activeTab = 'redemptions'"
      >
        {{ $t('admin.loyalty.redemptionOptions') }}
      </button>
    </div>

    <PointRulesList v-if="activeTab === 'rules'" />
    <PointRedemptionsList v-if="activeTab === 'redemptions'" />
  </div>
</template>

<style scoped>
.loyalty-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.loyalty-tabs__btn {
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

.loyalty-tabs__btn:hover {
  color: var(--color-on-surface);
}

.loyalty-tabs__btn--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
</style>
