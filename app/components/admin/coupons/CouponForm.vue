<script setup lang="ts">
import type { CreateCouponDto } from '~/types/api'

interface Props {
  form: CreateCouponDto
  loading?: boolean
}

type Emits = {
  submit: [form: CreateCouponDto]
  cancel: []
}

const props = defineProps<Props>()
defineEmits<Emits>()

const localForm = reactive<CreateCouponDto>({
  code: '',
  type: 'percentage',
  value: 0,
  minOrderValue: 0,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: undefined,
  isActive: true,
})

watch(
  () => props.form,
  (newForm) => {
    Object.assign(localForm, newForm)
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="coupon-form">
    <h2 class="coupon-form__title">New Coupon</h2>
    <form class="coupon-form__form" @submit="emitForm">
      <div class="coupon-form__row">
        <div class="coupon-form__field">
          <label class="coupon-form__label">Code *</label>
          <input
            v-model="localForm.code"
            type="text"
            class="coupon-form__input"
            required
            placeholder="SUMMER20"
          />
        </div>
        <div class="coupon-form__field">
          <label class="coupon-form__label">Type *</label>
          <select v-model="localForm.type" class="coupon-form__input">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
            <option value="free_shipping">Free Shipping</option>
          </select>
        </div>
      </div>
      <div class="coupon-form__row">
        <div class="coupon-form__field">
          <label class="coupon-form__label">Value</label>
          <input
            v-model.number="localForm.value"
            type="number"
            min="0"
            class="coupon-form__input"
            placeholder="20"
          />
        </div>
        <div class="coupon-form__field">
          <label class="coupon-form__label">Min Order Value</label>
          <input
            v-model.number="localForm.minOrderValue"
            type="number"
            min="0"
            class="coupon-form__input"
            placeholder="0"
          />
        </div>
        <div class="coupon-form__field">
          <label class="coupon-form__label">Start Date *</label>
          <input v-model="localForm.startDate" type="date" class="coupon-form__input" required />
        </div>
        <div class="coupon-form__field">
          <label class="coupon-form__label">End Date</label>
          <input v-model="localForm.endDate" type="date" class="coupon-form__input" />
        </div>
      </div>
      <label class="coupon-form__check">
        <input v-model="localForm.isActive" type="checkbox" /> Active
      </label>
      <button type="submit" class="coupon-form__submit" :disabled="loading">Create Coupon</button>
    </form>
  </div>
</template>

<style scoped>
.coupon-form {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.coupon-form__title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.coupon-form__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.coupon-form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
}

.coupon-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.coupon-form__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.coupon-form__input {
  background: var(--color-surface-container);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.coupon-form__input:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.coupon-form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.coupon-form__check input[type='checkbox'] {
  cursor: pointer;
}

.coupon-form__submit {
  align-self: flex-start;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow var(--transition-base);
}

.coupon-form__submit:hover:not(:disabled) {
  box-shadow: var(--shadow-btn-hover);
}

.coupon-form__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
