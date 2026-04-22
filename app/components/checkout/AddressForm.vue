<script setup lang="ts">
import { addressSchema } from '~/utils/validation'
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

type FieldKey = 'streetAddress' | 'city' | 'country' | 'postalCode' | 'state' | 'phone'
const touched = reactive<Record<FieldKey, boolean>>({
  streetAddress: false,
  city: false,
  country: false,
  postalCode: false,
  state: false,
  phone: false,
})
const fieldErrors = reactive<Record<FieldKey, string>>({
  streetAddress: '',
  city: '',
  country: '',
  postalCode: '',
  state: '',
  phone: '',
})
const submitAttempted = ref(false)
const loading = ref(false)

function validateField(field: FieldKey) {
  const result = addressSchema.safeParse(form)
  if (result.success) {
    fieldErrors[field] = ''
  } else {
    const issue = result.error.issues.find((i) => i.path[0] === field)
    fieldErrors[field] = issue?.message ?? ''
  }
}

function touchField(field: FieldKey) {
  touched[field] = true
  validateField(field)
}

function validateAll(): boolean {
  const fields: FieldKey[] = ['streetAddress', 'city', 'country', 'postalCode', 'state', 'phone']
  fields.forEach((f) => {
    touched[f] = true
    validateField(f)
  })
  return fields.every((f) => !fieldErrors[f])
}

async function handleSubmit() {
  submitAttempted.value = true
  if (!validateAll()) return
  loading.value = true
  try {
    emit('submit', { ...form })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="addr-form" novalidate @submit.prevent="handleSubmit">
    <div
      class="addr-form__field"
      :class="{ 'addr-form__field--error': touched.streetAddress && fieldErrors.streetAddress }"
    >
      <label class="addr-form__label" for="addr-street">
        Street Address <span class="addr-form__required" aria-hidden="true">*</span>
      </label>
      <input
        id="addr-street"
        v-model="form.streetAddress"
        type="text"
        class="addr-form__input"
        autocomplete="street-address"
        :aria-invalid="touched.streetAddress && !!fieldErrors.streetAddress"
        :aria-describedby="fieldErrors.streetAddress ? 'err-street' : undefined"
        @blur="touchField('streetAddress')"
      />
      <span
        v-if="touched.streetAddress && fieldErrors.streetAddress"
        id="err-street"
        class="addr-form__error"
        role="alert"
      >
        {{ fieldErrors.streetAddress }}
      </span>
    </div>

    <div class="addr-form__row">
      <div
        class="addr-form__field"
        :class="{ 'addr-form__field--error': touched.city && fieldErrors.city }"
      >
        <label class="addr-form__label" for="addr-city">
          City <span class="addr-form__required" aria-hidden="true">*</span>
        </label>
        <input
          id="addr-city"
          v-model="form.city"
          type="text"
          class="addr-form__input"
          autocomplete="address-level2"
          :aria-invalid="touched.city && !!fieldErrors.city"
          :aria-describedby="fieldErrors.city ? 'err-city' : undefined"
          @blur="touchField('city')"
        />
        <span
          v-if="touched.city && fieldErrors.city"
          id="err-city"
          class="addr-form__error"
          role="alert"
        >
          {{ fieldErrors.city }}
        </span>
      </div>

      <div
        class="addr-form__field"
        :class="{ 'addr-form__field--error': touched.country && fieldErrors.country }"
      >
        <label class="addr-form__label" for="addr-country">
          Country <span class="addr-form__required" aria-hidden="true">*</span>
        </label>
        <input
          id="addr-country"
          v-model="form.country"
          type="text"
          class="addr-form__input"
          autocomplete="country-name"
          :aria-invalid="touched.country && !!fieldErrors.country"
          :aria-describedby="fieldErrors.country ? 'err-country' : undefined"
          @blur="touchField('country')"
        />
        <span
          v-if="touched.country && fieldErrors.country"
          id="err-country"
          class="addr-form__error"
          role="alert"
        >
          {{ fieldErrors.country }}
        </span>
      </div>
    </div>

    <div class="addr-form__field">
      <label class="addr-form__label" for="addr-label">Address Label</label>
      <select id="addr-label" v-model="form.label" class="addr-form__input">
        <option value="home">Home</option>
        <option value="work">Work</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="addr-form__row">
      <div
        class="addr-form__field"
        :class="{ 'addr-form__field--error': touched.postalCode && fieldErrors.postalCode }"
      >
        <label class="addr-form__label" for="addr-zip">
          Postal Code <span class="addr-form__required" aria-hidden="true">*</span>
        </label>
        <input
          id="addr-zip"
          v-model="form.postalCode"
          type="text"
          class="addr-form__input"
          autocomplete="postal-code"
          :aria-invalid="touched.postalCode && !!fieldErrors.postalCode"
          :aria-describedby="fieldErrors.postalCode ? 'err-zip' : undefined"
          @blur="touchField('postalCode')"
        />
        <span
          v-if="touched.postalCode && fieldErrors.postalCode"
          id="err-zip"
          class="addr-form__error"
          role="alert"
        >
          {{ fieldErrors.postalCode }}
        </span>
      </div>

      <div
        class="addr-form__field"
        :class="{ 'addr-form__field--error': touched.state && fieldErrors.state }"
      >
        <label class="addr-form__label" for="addr-state">State / Province</label>
        <input
          id="addr-state"
          v-model="form.state"
          type="text"
          class="addr-form__input"
          autocomplete="address-level1"
          :aria-invalid="touched.state && !!fieldErrors.state"
          @blur="touchField('state')"
        />
        <span v-if="touched.state && fieldErrors.state" class="addr-form__error" role="alert">
          {{ fieldErrors.state }}
        </span>
      </div>
    </div>

    <div
      class="addr-form__field"
      :class="{ 'addr-form__field--error': touched.phone && fieldErrors.phone }"
    >
      <label class="addr-form__label" for="addr-phone">Phone</label>
      <input
        id="addr-phone"
        v-model="form.phone"
        type="tel"
        class="addr-form__input"
        autocomplete="tel"
        placeholder="+1 555 000 0000"
        :aria-invalid="touched.phone && !!fieldErrors.phone"
        :aria-describedby="fieldErrors.phone ? 'err-phone' : undefined"
        @blur="touchField('phone')"
      />
      <span
        v-if="touched.phone && fieldErrors.phone"
        id="err-phone"
        class="addr-form__error"
        role="alert"
      >
        {{ fieldErrors.phone }}
      </span>
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
        {{ loading ? 'Saving…' : 'Save Address' }}
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

.addr-form__required {
  color: var(--color-error);
}

.addr-form__input {
  background: var(--color-surface-container);
  border: 1.5px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.addr-form__input:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.addr-form__field--error .addr-form__input {
  border-color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 6%, var(--color-surface-container));
}

.addr-form__field--error .addr-form__input:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-error) 35%, transparent);
}

.addr-form__error {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.addr-form__error::before {
  content: 'error';
  font-family: var(--font-label);
  font-size: 0.875rem;
  line-height: 1;
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
