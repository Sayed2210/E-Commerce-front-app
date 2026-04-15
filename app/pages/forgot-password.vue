<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'guest' })

const { form, errors, loading, submitted, serverError, handleSubmit } = useForgotPassword()
</script>

<template>
  <AuthPageShell label="Forgot password page">
    <template v-if="submitted">
      <div class="fp-success">
        <div class="fp-success__icon-wrap" aria-hidden="true">
          <span class="material-symbols-outlined fp-success__icon">mark_email_read</span>
        </div>
        <h1 class="auth-card__title">Check your inbox</h1>
        <p class="auth-card__sub">
          We sent a reset link to <strong>{{ form.email }}</strong
          >. It may take a few minutes to arrive.
        </p>
        <NuxtLink to="/login" class="fp-success__back">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to Sign In
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <header class="auth-card__head">
        <div class="auth-card__icon-wrap" aria-hidden="true">
          <span class="material-symbols-outlined auth-card__icon">lock_reset</span>
        </div>
        <h1 class="auth-card__title">Forgot your password?</h1>
        <p class="auth-card__sub">Enter your email and we'll send you a reset link.</p>
      </header>

      <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
        <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
        {{ serverError }}
      </div>

      <form
        class="auth-form"
        novalidate
        aria-label="Forgot password form"
        @submit.prevent="handleSubmit"
      >
        <AppInput
          id="forgot-email"
          v-model="form.email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          :required="true"
          :error="errors.email"
        />
        <AppButton type="submit" :loading="loading" :block="true" size="lg">
          <span class="material-symbols-outlined" aria-hidden="true">send</span>
          Send Reset Link
        </AppButton>
      </form>

      <footer class="auth-card__foot">
        <p>
          Remember your password?
          <NuxtLink to="/login" class="auth-card__switch">Sign in</NuxtLink>
        </p>
      </footer>
    </template>
  </AuthPageShell>
</template>

<style scoped>
.fp-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.fp-success__icon-wrap {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-full);
  background: var(--color-primary-fixed);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.fp-success__icon {
  font-size: 2rem;
  color: var(--color-primary);
}

.fp-success__back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1rem;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap 200ms ease;
}

.fp-success__back:hover {
  gap: 0.625rem;
}

.fp-success__back:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
</style>
