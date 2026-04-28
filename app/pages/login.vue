<script setup lang="ts">
const { t } = useI18n()
const { loginSchema } = useValidation()

definePageMeta({ layout: false, middleware: 'guest' })
useSeoMeta({
  title: () => `${t('auth.signIn')} — ${t('brand.name')}`,
  robots: 'noindex, nofollow',
})

const { login, loading } = useAuth()
const form = ref({ email: '', password: '' })
const errors = ref<Record<string, string>>({})
const serverError = ref('')

async function handleSubmit() {
  serverError.value = ''
  errors.value = {}

  const result = loginSchema.safeParse(form.value)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.value[String(issue.path[0])] = issue.message
    }
    return
  }

  const { ok, error } = await login(form.value, false)
  if (!ok && error) serverError.value = error
}
</script>

<template>
  <AuthPageShell :label="t('auth.signIn')">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ t('auth.welcomeBack') }}</h1>
      <p class="auth-card__sub">{{ t('auth.signInToContinue') }}</p>
    </header>

    <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
      <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
      {{ serverError }}
    </div>

    <form
      class="auth-form"
      novalidate
      :aria-label="t('auth.signIn')"
      @submit.prevent="handleSubmit"
    >
      <AppInput
        id="login-email"
        v-model="form.email"
        :label="t('auth.emailAddress')"
        type="email"
        :placeholder="t('auth.emailPlaceholder')"
        autocomplete="email"
        :required="true"
        :error="errors.email"
      />
      <AppInput
        id="login-password"
        v-model="form.password"
        :label="t('auth.password')"
        type="password"
        :placeholder="t('auth.password')"
        autocomplete="current-password"
        :required="true"
        :error="errors.password"
      />
      <div class="auth-form__row">
        <label class="auth-check">
          <input type="checkbox" class="auth-check__input" />
          <span class="auth-check__label">{{ t('auth.rememberMe') }}</span>
        </label>
        <NuxtLink to="/forgot-password" class="auth-form__forgot">{{
          t('auth.forgotPassword')
        }}</NuxtLink>
      </div>
      <AppButton type="submit" :loading="loading" :block="true" size="lg">
        <span class="material-symbols-outlined" aria-hidden="true">login</span>
        {{ t('auth.signIn') }}
      </AppButton>
    </form>

    <footer class="auth-card__foot">
      <p>
        {{ t('auth.noAccount') }}
        <NuxtLink to="/register" class="auth-card__switch">{{ t('auth.createOne') }}</NuxtLink>
      </p>
    </footer>
  </AuthPageShell>
</template>

<style scoped>
.auth-form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.auth-form__forgot {
  font-family: var(--font-label);
  font-size: 0.8rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: text-decoration-color 200ms ease;
}

.auth-form__forgot:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.auth-form__forgot:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.auth-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.auth-check__input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.auth-check__label {
  font-family: var(--font-label);
  font-size: 0.8rem;
  color: var(--color-on-surface-variant);
}
</style>
