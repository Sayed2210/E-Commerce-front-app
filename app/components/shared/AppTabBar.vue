<script setup lang="ts">
export interface TabItem {
  value: string
  label: string
}

defineProps<{
  tabs: TabItem[]
  modelValue: string
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="tab-bar" role="tablist" :aria-label="$attrs['aria-label'] as string">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      class="tab-bar__btn"
      :class="{ 'tab-bar__btn--active': modelValue === tab.value }"
      :aria-selected="modelValue === tab.value"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  gap: 0.125rem;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-DEFAULT);
  padding: 0.1875rem;
  width: fit-content;
}

.tab-bar__btn {
  padding: 0.5rem 1rem;
  border-radius: calc(var(--radius-DEFAULT) - 0.0625rem);
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-secondary);
  background: transparent;
  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
  white-space: nowrap;
}

.tab-bar__btn:hover:not(.tab-bar__btn--active) {
  color: var(--color-on-surface);
}

.tab-bar__btn--active {
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font-weight: 600;
  box-shadow: 0 1px 4px color-mix(in srgb, var(--color-on-surface) 8%, transparent);
}

.tab-bar__btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
