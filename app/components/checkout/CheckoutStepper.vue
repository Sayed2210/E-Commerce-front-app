<script setup lang="ts">
defineProps<{ step: 1 | 2 | 3 }>()

const steps = [
  { n: 1, label: 'Address' },
  { n: 2, label: 'Payment' },
  { n: 3, label: 'Review' },
]
</script>

<template>
  <nav class="stepper" aria-label="Checkout progress">
    <ol class="stepper__list">
      <li
        v-for="(s, i) in steps"
        :key="s.n"
        class="stepper__item"
        :class="{
          'stepper__item--active': s.n === step,
          'stepper__item--done': s.n < step,
        }"
        :aria-current="s.n === step ? 'step' : undefined"
      >
        <span class="stepper__dot">
          <span v-if="s.n < step" class="material-symbols-outlined" aria-hidden="true">check</span>
          <span v-else>{{ s.n }}</span>
        </span>
        <span class="stepper__label">{{ s.label }}</span>
        <span v-if="i < steps.length - 1" class="stepper__line" aria-hidden="true" />
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.stepper__list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0 0 2rem;
  padding: 0;
}

.stepper__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.stepper__dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background: var(--color-surface-container-high);
  color: var(--color-secondary);
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: background var(--transition-base), color var(--transition-base);
}

.stepper__dot .material-symbols-outlined {
  font-size: 0.875rem;
}

.stepper__item--active .stepper__dot {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
}

.stepper__item--done .stepper__dot {
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
}

.stepper__label {
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-secondary);
  white-space: nowrap;
}

.stepper__item--active .stepper__label,
.stepper__item--done .stepper__label {
  color: var(--color-on-surface);
}

.stepper__line {
  flex: 1;
  height: 2px;
  background: var(--color-surface-container-high);
  margin-inline: 0.5rem;
  transition: background var(--transition-base);
}

.stepper__item--done .stepper__line {
  background: color-mix(in srgb, var(--color-primary) 30%, transparent);
}
</style>
