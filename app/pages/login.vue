<script setup lang="ts">
import { loginSchema } from '~/utils/validation'

definePageMeta({ layout: false, middleware: 'guest' })

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
  <div class="auth-page" aria-label="Sign in page">
    <!-- Background blobs for editorial warmth -->
    <div class="auth-page__bg" aria-hidden="true">
      <div class="auth-page__blob auth-page__blob--1" />
      <div class="auth-page__blob auth-page__blob--2" />
    </div>

    <!-- Nav bar (minimal) -->
    <header class="auth-nav" role="banner">
      <NuxtLink to="/" class="auth-nav__logo" aria-label="ArchitectMarket — home">
        ArchitectMarket
      </NuxtLink>
    </header>

    <!-- Glass card -->
    <main id="main-content" class="auth-main">
      <div class="auth-card" role="main">
        <!-- Heading -->
        <header class="auth-card__head">
          <h1 class="auth-card__title">Welcome back</h1>
          <p class="auth-card__sub">Sign in to your account to continue</p>
        </header>

        <!-- Server error -->
        <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
          <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
          {{ serverError }}
        </div>

        <!-- Form -->
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

          <!-- Remember / forgot row -->
          <div class="auth-form__row">
            <label class="auth-check">
              <input type="checkbox" class="auth-check__input" />
              <span class="auth-check__label">Remember me</span>
            </label>
            <NuxtLink to="/forgot-password" class="auth-form__forgot"> Forgot password? </NuxtLink>
          </div>

          <AppButton type="submit" :loading="loading" :block="true" size="lg">
            <span class="material-symbols-outlined" aria-hidden="true">login</span>
            Sign In
          </AppButton>
        </form>

        <!-- Footer link -->
        <footer class="auth-card__foot">
          <p>
            Don't have an account?
            <NuxtLink to="/register" class="auth-card__switch">Create one</NuxtLink>
          </p>
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Page shell ──────────────────────────────────────────────────────────── */
.auth-page {
  min-height: 100dvh;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Warm editorial background blobs */
.auth-page__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.auth-page__blob {
  position: absolute;
  border-radius: var(--radius-full);
  filter: blur(80px);
  opacity: 0.12;
}

.auth-page__blob--1 {
  width: 40vw;
  height: 40vw;
  background: var(--color-primary-container);
  top: -10%;
  right: -5%;
}

.auth-page__blob--2 {
  width: 30vw;
  height: 30vw;
  background: var(--color-primary);
  bottom: 0;
  left: 5%;
}

/* ── Minimal nav bar ─────────────────────────────────────────────────────── */
.auth-nav {
  position: relative;
  z-index: 10;
  padding: 1.25rem 2rem;
}

.auth-nav__logo {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  text-decoration: none;
  transition: color 200ms ease;
}

.auth-nav__logo:hover {
  color: var(--color-primary);
}

.auth-nav__logo:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* ── Main — centers the card ─────────────────────────────────────────────── */
.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  z-index: 1;
}

/* ── Glass card ──────────────────────────────────────────────────────────── */
.auth-card {
  width: 100%;
  max-width: 26rem;
  background: color-mix(in srgb, var(--color-surface-container-lowest) 85%, transparent);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  box-shadow: 0 24px 64px color-mix(in srgb, var(--color-on-surface) 8%, transparent);
}

/* ── Card header ─────────────────────────────────────────────────────────── */
.auth-card__head {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-card__title {
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0 0 0.375rem;
}

.auth-card__sub {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-on-surface-variant);
  margin: 0;
}

/* ── Server error alert ──────────────────────────────────────────────────── */
.auth-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: var(--color-error-container);
  color: var(--color-on-error-container);
  border-radius: var(--radius-DEFAULT);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

.auth-alert__icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 0.0625rem;
}

/* ── Form ────────────────────────────────────────────────────────────────── */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

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

/* Custom checkbox */
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

/* ── Card footer ─────────────────────────────────────────────────────────── */
.auth-card__foot {
  margin-top: 1.75rem;
  text-align: center;
}

.auth-card__foot p {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
  margin: 0;
}

.auth-card__switch {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: text-decoration-color 200ms ease;
}

.auth-card__switch:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.auth-card__switch:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
</style>
