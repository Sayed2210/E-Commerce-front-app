<script setup lang="ts">
import type { PaymentMethod } from '~/types/api'

defineProps<{ modelValue: PaymentMethod }>()
const emit = defineEmits<{ 'update:modelValue': [v: PaymentMethod] }>()

const methods: { value: PaymentMethod; icon: string; label: string; description: string }[] = [
  {
    value: 'cash_on_delivery',
    icon: 'local_shipping',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
  },
  {
    value: 'stripe',
    icon: 'credit_card',
    label: 'Credit / Debit Card',
    description: 'Secure payment via Stripe',
  },
]
</script>

<template>
  <section class="payment">
    <h2 class="payment__title">Payment Method</h2>
    <div class="payment__list">
      <label
        v-for="m in methods"
        :key="m.value"
        class="payment__card"
        :class="{ 'payment__card--selected': modelValue === m.value }"
      >
        <input
          type="radio"
          name="payment-method"
          class="payment__radio"
          :value="m.value"
          :checked="modelValue === m.value"
          @change="emit('update:modelValue', m.value)"
        />
        <span class="payment__icon">
          <span class="material-symbols-outlined" aria-hidden="true">{{ m.icon }}</span>
        </span>
        <span class="payment__info">
          <span class="payment__label">{{ m.label }}</span>
          <span class="payment__desc">{{ m.description }}</span>
        </span>
      </label>
    </div>
  </section>
</template>

<style scoped>
.payment__title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.payment__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment__card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background var(--transition-fast), box-shadow var(--transition-base);
}

.payment__card--selected {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.payment__radio {
  accent-color: var(--color-primary);
  flex-shrink: 0;
}

.payment__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-DEFAULT);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  flex-shrink: 0;
}

.payment__icon .material-symbols-outlined {
  font-size: 1.25rem;
}

.payment__info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.payment__label {
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.payment__desc {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-secondary);
}
</style>
