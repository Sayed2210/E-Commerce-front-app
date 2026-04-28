<script setup lang="ts">
const { t } = useI18n()
const { registerSchema } = useValidation()

definePageMeta({ layout: false, middleware: 'guest' })
useSeoMeta({
  title: () => `${t('auth.createAccount')} — ${t('brand.name')}`,
  robots: 'noindex, nofollow',
})

const { register, loading } = useAuth()
const form = ref({
  email: '',
  password: '',
  passwordConfirmation: '',
  firstName: '',
  lastName: '',
})
const errors = ref<Record<string, string>>({})
const serverError = ref('')
const acceptTerms = ref(false)

async function handleSubmit() {
  serverError.value = ''
  errors.value = {}

  if (!acceptTerms.value) {
    serverError.value = t('auth.termsRequired')
    return
  }

  const result = registerSchema.safeParse(form.value)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.value[String(issue.path[0])] = issue.message
    }
    return
  }

  const { ok, error } = await register(form.value)
  if (!ok && error) serverError.value = error
}
</script>

<template>
  <AuthPageShell :label="t('auth.createAccount')" card-width="30rem">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ t('auth.createAccount') }}</h1>
      <p class="auth-card__sub">{{ t('auth.joinToday') }}</p>
    </header>

    <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
      <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
      {{ serverError }}
    </div>

    <form
      class="auth-form"
      novalidate
      :aria-label="t('auth.createAccount')"
      @submit.prevent="handleSubmit"
    >
      <RegisterFormFields v-model="form" :errors="errors" />

      <label class="auth-terms">
        <input
          v-model="acceptTerms"
          type="checkbox"
          class="auth-terms__check"
          aria-required="true"
        />
        <span class="auth-terms__text">
          {{ t('auth.termsPrefix') }}
          <a href="#" class="auth-terms__link">{{ t('auth.termsAndConditions') }}</a>
          {{ t('auth.and') }}
          <a href="#" class="auth-terms__link">{{ t('auth.privacyPolicy') }}</a>
        </span>
      </label>

      <AppButton type="submit" :loading="loading" :disabled="!acceptTerms" :block="true" size="lg">
        <span class="material-symbols-outlined" aria-hidden="true">person_add</span>
        {{ t('auth.createAccountBtn') }}
      </AppButton>
    </form>

    <footer class="auth-card__foot">
      <p>
        {{ t('auth.alreadyHaveAccount') }}
        <NuxtLink to="/login" class="auth-card__switch">{{ t('auth.signIn') }}</NuxtLink>
      </p>
    </footer>
  </AuthPageShell>
</template>

<style scoped>
.auth-terms {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  cursor: pointer;
}

.auth-terms__check {
  width: 1rem;
  height: 1rem;
  margin-top: 0.1rem;
  accent-color: var(--color-primary);
  cursor: pointer;
  flex-shrink: 0;
}

.auth-terms__text {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface-variant);
  line-height: 1.5;
}

.auth-terms__link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.auth-terms__link:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
</style>
