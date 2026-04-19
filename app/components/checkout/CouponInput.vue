<script setup lang="ts">
import type { ApplyCouponResponse } from '~/types/api'

const emit = defineEmits<{ applied: [result: ApplyCouponResponse & { code: string }] }>()

const { applyCoupon } = useCheckout()
const code = ref('')
const loading = ref(false)
const result = ref<ApplyCouponResponse | null>(null)
const error = ref('')

async function handleApply() {
  if (!code.value.trim()) return
  loading.value = true
  error.value = ''
  result.value = null
  const { data } = await applyCoupon(code.value.trim())
  loading.value = false
  if (data) {
    result.value = data
    emit('applied', { ...data, code: code.value.trim() })
  } else {
    error.value = 'Invalid or expired coupon code.'
  }
}
</script>

<template>
  <div class="coupon">
    <label class="coupon__label" for="coupon-code">Coupon Code</label>
    <div class="coupon__row">
      <input
        id="coupon-code"
        v-model="code"
        type="text"
        class="coupon__input"
        placeholder="Enter code"
        autocomplete="off"
        :disabled="!!result"
        @keyup.enter="handleApply"
      />
      <button
        type="button"
        class="coupon__btn"
        :disabled="loading || !!result"
        @click="handleApply"
      >
        {{ loading ? '…' : result ? 'Applied' : 'Apply' }}
      </button>
    </div>
    <p v-if="result" class="coupon__msg coupon__msg--ok">
      <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
      Coupon applied — {{ result.type === 'percentage' ? `${result.discountValue}% off` : `$${result.discountValue} off` }}
    </p>
    <p v-if="error" class="coupon__msg coupon__msg--err">{{ error }}</p>
  </div>
</template>

<style scoped>
.coupon {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.coupon__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.coupon__row {
  display: flex;
  gap: 0.5rem;
}

.coupon__input {
  flex: 1;
  background: var(--color-surface-container);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  transition: background var(--transition-fast), box-shadow var(--transition-fast);
}

.coupon__input:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.coupon__input:disabled {
  opacity: 0.7;
}

.coupon__btn {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-DEFAULT);
  padding: 0 1.25rem;
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow var(--transition-base), opacity var(--transition-fast);
  white-space: nowrap;
}

.coupon__btn:hover:not(:disabled) {
  box-shadow: var(--shadow-btn-hover);
}

.coupon__btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.coupon__msg {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0;
}

.coupon__msg .material-symbols-outlined {
  font-size: 0.875rem;
}

.coupon__msg--ok {
  color: var(--color-tertiary);
}

.coupon__msg--err {
  color: var(--color-error);
}
</style>
