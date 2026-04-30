<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { t } = useI18n()
const { activeCurrencies, currentCurrency, setCurrency } = useCurrency()

const open = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

function select(code: string) {
  setCurrency(code)
  open.value = false
}

onClickOutside(switcherRef, () => {
  open.value = false
})
</script>

<template>
  <div ref="switcherRef" class="currency-switcher">
    <button
      type="button"
      class="currency-switcher__trigger"
      :aria-label="t('currency.switcherLabel')"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="material-symbols-outlined" aria-hidden="true">payments</span>
      <span class="currency-switcher__code">{{ currentCurrency.code }}</span>
      <span class="material-symbols-outlined currency-switcher__arrow" aria-hidden="true">
        {{ open ? 'expand_less' : 'expand_more' }}
      </span>
    </button>

    <div v-if="open" class="currency-switcher__dropdown" role="menu">
      <button
        v-for="c in activeCurrencies"
        :key="c.code"
        type="button"
        class="currency-switcher__item"
        :class="{ 'currency-switcher__item--active': c.code === currentCurrency.code }"
        role="menuitem"
        @click="select(c.code)"
      >
        <span class="currency-switcher__symbol">{{ c.symbol }}</span>
        <span class="currency-switcher__name">{{ c.name }}</span>
        <span class="currency-switcher__rate">1 USD = {{ c.exchangeRate }} {{ c.code }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.currency-switcher {
  position: relative;
}

.currency-switcher__trigger {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: 1px solid color-mix(in srgb, var(--color-outline) 30%, transparent);
  border-radius: var(--radius-sm);
  padding: 0.375rem 0.625rem;
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-on-surface);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.currency-switcher__trigger:hover {
  background: var(--color-surface-container-low);
}

.currency-switcher__trigger .material-symbols-outlined {
  font-size: 1rem;
  color: var(--color-secondary);
}

.currency-switcher__code {
  min-width: 2rem;
  text-align: center;
}

.currency-switcher__arrow {
  font-size: 0.875rem !important;
}

.currency-switcher__dropdown {
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  min-width: 14rem;
  background: var(--color-surface-container-lowest);
  border: 1px solid color-mix(in srgb, var(--color-outline-variant) 20%, transparent);
  border-radius: var(--radius-lg);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: var(--shadow-dropdown);
  z-index: 50;
}

.currency-switcher__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}

.currency-switcher__item:hover {
  background: var(--color-surface-container-low);
}

.currency-switcher__item--active {
  background: color-mix(in srgb, var(--color-primary-container) 30%, transparent);
  color: var(--color-primary);
  font-weight: 600;
}

.currency-switcher__symbol {
  font-family: var(--font-label);
  font-weight: 700;
  min-width: 1.25rem;
}

.currency-switcher__name {
  flex: 1;
}

.currency-switcher__rate {
  font-size: 0.75rem;
  color: var(--color-secondary);
}

.currency-switcher__item--active .currency-switcher__rate {
  color: var(--color-primary);
}
</style>
