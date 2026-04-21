<script setup lang="ts">
import type { CreateAddressDto } from '~/types/api'

const emit = defineEmits<{
  submit: [dto: CreateAddressDto]
  cancel: []
}>()

const form = reactive<CreateAddressDto>({
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  isDefault: false,
  label: 'home',
})

const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    emit('submit', { ...form })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="addr-form" @submit.prevent="handleSubmit">
    <div class="addr-form__field">
      <label class="addr-form__label" for="addr-street"
        >Street Address <span aria-hidden="true">*</span></label
      >
      <input
        id="addr-street"
        v-model="form.streetAddress"
        type="text"
        class="addr-form__input"
        required
      />
    </div>

    <div class="addr-form__row">
      <div class="addr-form__field">
        <label class="addr-form__label" for="addr-city"
          >City <span aria-hidden="true">*</span></label
        >
        <input id="addr-city" v-model="form.city" type="text" class="addr-form__input" required />
      </div>
      <div class="addr-form__field">
        <label class="addr-form__label" for="addr-country"
          >Country <span aria-hidden="true">*</span></label
        >
        <input
          id="addr-country"
          v-model="form.country"
          type="text"
          class="addr-form__input"
          required
        />
      </div>
    </div>
    <!-- <div class="addr-form__row"> -->
    <div class="addr-form__field">
      <label class="addr-form__label" for="addr-label">Address Label</label>
      <select id="addr-label" v-model="form.label" class="addr-form__input">
        <option value="home">Home</option>
        <option value="work">Work</option>
        <option value="other">Other</option>
      </select>
    </div>
    <!-- </div> -->

    <div class="addr-form__row">
      <div class="addr-form__field">
        <label class="addr-form__label" for="addr-zip"
          >Postal Code <span aria-hidden="true">*</span></label
        >
        <input
          id="addr-zip"
          v-model="form.postalCode"
          type="text"
          class="addr-form__input"
          required
        />
      </div>
      <div class="addr-form__field">
        <label class="addr-form__label" for="addr-state">State / Province</label>
        <input id="addr-state" v-model="form.state" type="text" class="addr-form__input" />
      </div>
    </div>

    <div class="addr-form__field">
      <label class="addr-form__label" for="addr-phone">Phone</label>
      <input id="addr-phone" v-model="form.phone" type="tel" class="addr-form__input" />
    </div>

    <label class="addr-form__check">
      <input v-model="form.isDefault" type="checkbox" class="addr-form__checkbox" />
      Set as default address
    </label>

    <div class="addr-form__actions">
      <button type="button" class="addr-form__btn addr-form__btn--ghost" @click="emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="addr-form__btn addr-form__btn--primary" :disabled="loading">
        Save Address
      </button>
    </div>
  </form>
</template>

<style scoped>
.addr-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.addr-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.addr-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.addr-form__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.addr-form__input {
  background: var(--color-surface-container);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.addr-form__input:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.addr-form__check {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  cursor: pointer;
}

.addr-form__checkbox {
  accent-color: var(--color-primary);
  width: 1rem;
  height: 1rem;
}

.addr-form__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.addr-form__btn {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-DEFAULT);
  border: none;
  cursor: pointer;
  transition:
    box-shadow var(--transition-base),
    opacity var(--transition-fast);
}

.addr-form__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.addr-form__btn--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
}

.addr-form__btn--primary:hover:not(:disabled) {
  box-shadow: var(--shadow-btn-hover);
}

.addr-form__btn--ghost {
  background: none;
  color: var(--color-secondary);
  border: 1px solid color-mix(in srgb, var(--color-outline) 30%, transparent);
}

.addr-form__btn--ghost:hover {
  background: var(--color-surface-container-low);
}
</style>
