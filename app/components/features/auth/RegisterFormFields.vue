<script setup lang="ts">
const { t } = useI18n()

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
      :label="t('auth.firstName')"
      type="text"
      :placeholder="t('auth.firstNamePlaceholder')"
      autocomplete="given-name"
      :error="errors.firstName"
      @update:model-value="set('firstName', $event)"
    />
    <AppInput
      id="reg-last"
      :model-value="model.lastName"
      :label="t('auth.lastName')"
      type="text"
      :placeholder="t('auth.lastNamePlaceholder')"
      autocomplete="family-name"
      :error="errors.lastName"
      @update:model-value="set('lastName', $event)"
    />
  </div>

  <AppInput
    id="reg-email"
    :model-value="model.email"
    :label="t('auth.emailAddress')"
    type="email"
    :placeholder="t('auth.emailPlaceholder')"
    autocomplete="email"
    :required="true"
    :error="errors.email"
    @update:model-value="set('email', $event)"
  />

  <AppInput
    id="reg-password"
    :model-value="model.password"
    :label="t('auth.password')"
    type="password"
    :placeholder="t('auth.passwordPlaceholder')"
    autocomplete="new-password"
    :required="true"
    :error="errors.password"
    @update:model-value="set('password', $event)"
  />

  <AppInput
    id="reg-confirm"
    :model-value="model.passwordConfirmation"
    :label="t('auth.confirmPassword')"
    type="password"
    :placeholder="t('auth.confirmPasswordPlaceholder')"
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
