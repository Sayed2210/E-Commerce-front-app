<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'guest' })

const { form, errors, loading, success, serverError, invalidToken, handleSubmit } =
  useResetPassword()
</script>

<template>
  <AuthPageShell label="Reset password page">
    <div v-if="invalidToken" class="rp-state">
      <div class="rp-state__icon-wrap rp-state__icon-wrap--error" aria-hidden="true">
        <span class="material-symbols-outlined rp-state__icon">link_off</span>
      </div>
      <h1 class="auth-card__title">Invalid reset link</h1>
      <p class="auth-card__sub">This link is missing a reset token. Please request a new one.</p>
      <NuxtLink to="/forgot-password" class="auth-btn-link">Request new link</NuxtLink>
    </div>

    <div v-else-if="success" class="rp-state">
      <div class="rp-state__icon-wrap rp-state__icon-wrap--success" aria-hidden="true">
        <span class="material-symbols-outlined rp-state__icon">check_circle</span>
      </div>
      <h1 class="auth-card__title">Password updated!</h1>
      <p class="auth-card__sub">Your password has been reset. Redirecting you to sign in&hellip;</p>
      <NuxtLink to="/login" class="auth-btn-link">Sign in now</NuxtLink>
    </div>

    <template v-else>
      <header class="auth-card__head">
        <div class="auth-card__icon-wrap" aria-hidden="true">
          <span class="material-symbols-outlined auth-card__icon">lock_open</span>
        </div>
        <h1 class="auth-card__title">Set new password</h1>
        <p class="auth-card__sub">Choose a strong password for your account.</p>
      </header>

      <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
        <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
        {{ serverError }}
      </div>

      <form
        class="auth-form"
        novalidate
        aria-label="Reset password form"
        @submit.prevent="handleSubmit"
      >
        <AppInput
          id="reset-password"
          v-model="form.newPassword"
          label="New password"
          type="password"
          placeholder="Min. 6 characters"
          autocomplete="new-password"
          :required="true"
          :error="errors.newPassword"
        />
        <AppInput
          id="reset-confirm"
          v-model="form.confirmPassword"
          label="Confirm new password"
          type="password"
          placeholder="Repeat your new password"
          autocomplete="new-password"
          :required="true"
          :error="errors.confirmPassword"
        />
        <AppButton type="submit" :loading="loading" :block="true" size="lg">
          <span class="material-symbols-outlined" aria-hidden="true">lock_reset</span>
          Reset Password
        </AppButton>
      </form>

      <footer class="auth-card__foot">
        <p><NuxtLink to="/login" class="auth-card__switch">Back to Sign In</NuxtLink></p>
      </footer>
    </template>
  </AuthPageShell>
</template>

<style scoped>
.rp-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.rp-state__icon-wrap {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.rp-state__icon-wrap--success {
  background: var(--color-primary-fixed);
}

.rp-state__icon-wrap--error {
  background: var(--color-error-container);
}

.rp-state__icon {
  font-size: 2rem;
}

.rp-state__icon-wrap--success .rp-state__icon {
  color: var(--color-primary);
}

.rp-state__icon-wrap--error .rp-state__icon {
  color: var(--color-on-error-container);
}
</style>
