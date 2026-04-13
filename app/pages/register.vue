<script setup lang="ts">
import { registerSchema } from '~/utils/validation'

definePageMeta({ layout: false, middleware: 'guest' })

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
    serverError.value = 'You must accept the Terms & Conditions to continue.'
    return
  }

  const result = registerSchema.safeParse(form.value)
  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.value[String(issue.path[0])] = issue.message
    }
    return
  }

  const ok = await register(form.value)
  if (!ok) serverError.value = 'Registration failed. Please try again.'
}
</script>

<template>
  <div class="auth-page" aria-label="Create account page">
    <div class="auth-page__bg" aria-hidden="true">
      <div class="auth-page__blob auth-page__blob--1" />
      <div class="auth-page__blob auth-page__blob--2" />
    </div>

    <header class="auth-nav" role="banner">
      <NuxtLink to="/" class="auth-nav__logo" aria-label="ArchitectMarket — home">
        ArchitectMarket
      </NuxtLink>
    </header>

    <main id="main-content" class="auth-main">
      <div class="auth-card" role="main">
        <header class="auth-card__head">
          <h1 class="auth-card__title">Create your account</h1>
          <p class="auth-card__sub">Join and start shopping today</p>
        </header>

        <!-- Server error -->
        <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
          <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
          {{ serverError }}
        </div>

        <form
          class="auth-form"
          novalidate
          aria-label="Create account form"
          @submit.prevent="handleSubmit"
        >
          <!-- Name row -->
          <div class="auth-form__grid">
            <AppInput
              id="reg-first"
              v-model="form.firstName"
              label="First name"
              type="text"
              placeholder="Jane"
              autocomplete="given-name"
              :error="errors.firstName"
            />
            <AppInput
              id="reg-last"
              v-model="form.lastName"
              label="Last name"
              type="text"
              placeholder="Doe"
              autocomplete="family-name"
              :error="errors.lastName"
            />
          </div>

          <AppInput
            id="reg-email"
            v-model="form.email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            :required="true"
            :error="errors.email"
          />

          <AppInput
            id="reg-password"
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            autocomplete="new-password"
            :required="true"
            :error="errors.password"
          />

          <AppInput
            id="reg-confirm"
            v-model="form.passwordConfirmation"
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            autocomplete="new-password"
            :required="true"
            :error="errors.passwordConfirmation"
          />

          <!-- Terms checkbox -->
          <label class="auth-terms">
            <input
              v-model="acceptTerms"
              type="checkbox"
              class="auth-terms__check"
              aria-required="true"
            />
            <span class="auth-terms__text">
              I agree to the
              <a href="#" class="auth-terms__link">Terms &amp; Conditions</a>
              and
              <a href="#" class="auth-terms__link">Privacy Policy</a>
            </span>
          </label>

          <AppButton
            type="submit"
            :loading="loading"
            :disabled="!acceptTerms"
            :block="true"
            size="lg"
          >
            <span class="material-symbols-outlined" aria-hidden="true">person_add</span>
            Create Account
          </AppButton>
        </form>

        <footer class="auth-card__foot">
          <p>
            Already have an account?
            <NuxtLink to="/login" class="auth-card__switch">Sign in</NuxtLink>
          </p>
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Page / blobs — same as login ────────────────────────────────────────── */
.auth-page {
  min-height: 100dvh;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

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
  opacity: 0.1;
}

.auth-page__blob--1 {
  width: 35vw;
  height: 35vw;
  background: var(--color-primary-container);
  top: -8%;
  left: 60%;
}

.auth-page__blob--2 {
  width: 28vw;
  height: 28vw;
  background: var(--color-primary);
  bottom: 5%;
  left: -5%;
}

/* ── Nav ─────────────────────────────────────────────────────────────────── */
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

/* ── Main ────────────────────────────────────────────────────────────────── */
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
  max-width: 30rem;
  background: color-mix(in srgb, var(--color-surface-container-lowest) 85%, transparent);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  box-shadow: 0 24px 64px color-mix(in srgb, var(--color-on-surface) 8%, transparent);
}

.auth-card__head {
  text-align: center;
  margin-bottom: 1.75rem;
}

.auth-card__title {
  font-family: var(--font-headline);
  font-size: 1.625rem;
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

/* ── Alert ───────────────────────────────────────────────────────────────── */
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
  gap: 1.125rem;
}

/* Two-column name row */
.auth-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (width <= 400px) {
  .auth-form__grid {
    grid-template-columns: 1fr;
  }
}

/* ── Terms ───────────────────────────────────────────────────────────────── */
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

/* ── Card footer ─────────────────────────────────────────────────────────── */
.auth-card__foot {
  margin-top: 1.5rem;
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
