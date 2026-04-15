<script setup lang="ts">
type FormFields = {
  email: string
  password: string
  passwordConfirmation: string
  firstName: string
  lastName: string
}

defineProps<{ errors: Record<string, string> }>()

const model = defineModel<FormFields>({ required: true })

function set<K extends keyof FormFields>(key: K, value: string) {
  model.value = { ...model.value, [key]: value }
}
</script>

<template>
  <div class="reg-grid">
    <AppInput
      id="reg-first"
      :model-value="model.firstName"
      label="First name"
      type="text"
      placeholder="Jane"
      autocomplete="given-name"
      :error="errors.firstName"
      @update:model-value="set('firstName', $event)"
    />
    <AppInput
      id="reg-last"
      :model-value="model.lastName"
      label="Last name"
      type="text"
      placeholder="Doe"
      autocomplete="family-name"
      :error="errors.lastName"
      @update:model-value="set('lastName', $event)"
    />
  </div>

  <AppInput
    id="reg-email"
    :model-value="model.email"
    label="Email address"
    type="email"
    placeholder="you@example.com"
    autocomplete="email"
    :required="true"
    :error="errors.email"
    @update:model-value="set('email', $event)"
  />

  <AppInput
    id="reg-password"
    :model-value="model.password"
    label="Password"
    type="password"
    placeholder="Minimum 6 characters"
    autocomplete="new-password"
    :required="true"
    :error="errors.password"
    @update:model-value="set('password', $event)"
  />

  <AppInput
    id="reg-confirm"
    :model-value="model.passwordConfirmation"
    label="Confirm password"
    type="password"
    placeholder="Re-enter your password"
    autocomplete="new-password"
    :required="true"
    :error="errors.passwordConfirmation"
    @update:model-value="set('passwordConfirmation', $event)"
  />
</template>

<style scoped>
.reg-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (width <= 400px) {
  .reg-grid {
    grid-template-columns: 1fr;
  }
}
</style>
