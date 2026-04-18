<script setup lang="ts">
import { loginSchema } from '~/utils/validation'

definePageMeta({ layout: false, middleware: 'guest' })
useSeoMeta({ title: 'Sign In — ArchitectMarket', robots: 'noindex, nofollow' })

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

  const ok = await login(form.value, false)
  if (!ok) serverError.value = 'Invalid email or password. Please try again.'
}
</script>

<template>
  <AuthPageShell label="Sign in page">
    <header class="auth-card__head">
      <h1 class="auth-card__title">Welcome back</h1>
      <p class="auth-card__sub">Sign in to your account to continue</p>
    </header>

    <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
      <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
      {{ serverError }}
    </div>

    <form class="auth-form" novalidate aria-label="Sign in form" @submit.prevent="handleSubmit">
      <AppInput
        id="login-email"
        v-model="form.email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :required="true"
        :error="errors.email"
      />
      <AppInput
        id="login-password"
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Your password"
        autocomplete="current-password"
        :required="true"
        :error="errors.password"
      />
      <div class="auth-form__row">
        <label class="auth-check">
          <input type="checkbox" class="auth-check__input" />
          <span class="auth-check__label">Remember me</span>
        </label>
        <NuxtLink to="/forgot-password" class="auth-form__forgot">Forgot password?</NuxtLink>
      </div>
      <AppButton type="submit" :loading="loading" :block="true" size="lg">
        <span class="material-symbols-outlined" aria-hidden="true">login</span>
        Sign In
      </AppButton>
    </form>

    <footer class="auth-card__foot">
      <p>
        Don't have an account?
        <NuxtLink to="/register" class="auth-card__switch">Create one</NuxtLink>
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
