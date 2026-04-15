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
  <AuthPageShell label="Create account page" card-width="30rem">
    <header class="auth-card__head">
      <h1 class="auth-card__title">Create your account</h1>
      <p class="auth-card__sub">Join and start shopping today</p>
    </header>

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
      <RegisterFormFields v-model="form" :errors="errors" />

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

      <AppButton type="submit" :loading="loading" :disabled="!acceptTerms" :block="true" size="lg">
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
