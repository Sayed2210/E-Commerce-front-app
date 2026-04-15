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

<style scoped lang="scss" src="./AppInput.scss"></style>
