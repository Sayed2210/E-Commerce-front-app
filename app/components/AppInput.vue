<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Must be unique on the page — wires label → input + aria-describedby */
    id: string
    label: string
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'
    placeholder?: string
    /** Inline error — shown instead of hint; marks input aria-invalid */
    error?: string
    /** Helper text below the field */
    hint?: string
    required?: boolean
    disabled?: boolean
    autocomplete?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
  }
)

const modelValue = defineModel<string>({ default: '' })

const showPassword = ref(false)

const resolvedType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password'
  return props.type
})

const errorId = computed(() => `${props.id}-error`)
const hintId = computed(() => `${props.id}-hint`)

const ariaDescribedby = computed(() => {
  if (props.error) return errorId.value
  if (props.hint) return hintId.value
  return undefined
})
</script>

<template>
  <div class="field" :class="{ 'field--error': error, 'field--disabled': disabled }">
    <!-- Label -->
    <label :for="id" class="field__label">
      {{ label }}
      <span v-if="required" class="field__req" aria-hidden="true"> *</span>
    </label>

    <!-- Input wrapper -->
    <div class="field__wrap">
      <input
        :id="id"
        v-model="modelValue"
        class="field__input"
        :class="{ 'field__input--with-toggle': type === 'password' }"
        :type="resolvedType"
        :name="id"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="error ? 'true' : undefined"
        :aria-required="required ? 'true' : undefined"
      />

      <!-- Password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="field__toggle"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :aria-controls="id"
        :aria-pressed="showPassword"
        tabindex="0"
        @click="showPassword = !showPassword"
      >
        <span class="material-symbols-outlined" aria-hidden="true">
          {{ showPassword ? 'visibility_off' : 'visibility' }}
        </span>
      </button>
    </div>

    <!-- Hint text -->
    <p v-if="hint && !error" :id="hintId" class="field__hint">{{ hint }}</p>

    <!-- Error message — role="alert" announces it to screen readers on appearance -->
    <p v-if="error" :id="errorId" class="field__error" role="alert">
      <span class="material-symbols-outlined field__error-icon" aria-hidden="true">error</span>
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* ── Container ───────────────────────────────────────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/* ── Label ───────────────────────────────────────────────────────────────── */
.field__label {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field__req {
  color: var(--color-error);
}

/* ── Wrap (positions toggle button) ──────────────────────────────────────── */
.field__wrap {
  position: relative;
}

/* ── Input ───────────────────────────────────────────────────────────────── */
.field__input {
  width: 100%;
  background: var(--color-surface-variant);
  border: none;
  border-bottom: 1.5px solid color-mix(in srgb, var(--color-outline) 30%, transparent);
  border-radius: var(--radius-DEFAULT) var(--radius-DEFAULT) 0 0;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-on-surface);
  outline: none;
  transition: border-color 200ms ease;
}

.field__input--with-toggle {
  padding-right: 2.75rem;
}

.field__input:focus {
  /* upgrade bottom border on focus — keep height stable by compensating padding */
  border-bottom-width: 2px;
  border-bottom-color: var(--color-primary);
  padding-bottom: calc(0.75rem - 0.5px);
}

.field__input::placeholder {
  color: var(--color-on-surface-variant);
  opacity: 0.5;
}

.field--disabled .field__input {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error state overrides */
.field--error .field__input {
  border-bottom-color: var(--color-error);
}

.field--error .field__input:focus {
  border-bottom-color: var(--color-error);
}

/* ── Password toggle button ──────────────────────────────────────────────── */
.field__toggle {
  position: absolute;
  inset-block: 0;
  right: 0.75rem;
  margin: auto;
  height: 1.5rem;
  width: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: color 200ms ease;
  padding: 0;
}

.field__toggle:hover {
  color: var(--color-primary);
}

.field__toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

/* ── Hint / Error text ───────────────────────────────────────────────────── */
.field__hint {
  font-family: var(--font-label);
  font-size: 0.75rem;
  color: var(--color-on-surface-variant);
  margin: 0;
}

.field__error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-label);
  font-size: 0.75rem;
  color: var(--color-error);
  margin: 0;
}

.field__error-icon {
  font-size: 0.875rem !important;
  flex-shrink: 0;
}
</style>
