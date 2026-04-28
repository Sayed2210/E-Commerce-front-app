<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ layout: false, middleware: 'guest' })
useSeoMeta({
  title: () => `${t('auth.setNewPassword')} — ${t('brand.name')}`,
  robots: 'noindex, nofollow',
})

const { form, errors, loading, success, serverError, invalidToken, handleSubmit } =
  useResetPassword()
</script>

<template>
  <AuthPageShell :label="t('auth.setNewPassword')">
    <div v-if="invalidToken" class="rp-state">
      <div class="rp-state__icon-wrap rp-state__icon-wrap--error" aria-hidden="true">
        <span class="material-symbols-outlined rp-state__icon">link_off</span>
      </div>
      <h1 class="auth-card__title">{{ t('auth.invalidResetLink') }}</h1>
      <p class="auth-card__sub">{{ t('auth.missingResetToken') }}</p>
      <NuxtLink to="/forgot-password" class="auth-btn-link">{{
        t('auth.requestNewLink')
      }}</NuxtLink>
    </div>

    <div v-else-if="success" class="rp-state">
      <div class="rp-state__icon-wrap rp-state__icon-wrap--success" aria-hidden="true">
        <span class="material-symbols-outlined rp-state__icon">check_circle</span>
      </div>
      <h1 class="auth-card__title">{{ t('auth.passwordUpdated') }}</h1>
      <p class="auth-card__sub">{{ t('auth.passwordUpdatedSubtitle') }}</p>
      <NuxtLink to="/login" class="auth-btn-link">{{ t('auth.signInNow') }}</NuxtLink>
    </div>

    <template v-else>
      <header class="auth-card__head">
        <div class="auth-card__icon-wrap" aria-hidden="true">
          <span class="material-symbols-outlined auth-card__icon">lock_open</span>
        </div>
        <h1 class="auth-card__title">{{ t('auth.setNewPassword') }}</h1>
        <p class="auth-card__sub">{{ t('auth.newPasswordSubtitle') }}</p>
      </header>

      <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
        <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
        {{ serverError }}
      </div>

      <form
        class="auth-form"
        novalidate
        :aria-label="t('auth.setNewPassword')"
        @submit.prevent="handleSubmit"
      >
        <AppInput
          id="reset-password"
          v-model="form.newPassword"
          :label="t('auth.newPassword')"
          type="password"
          :placeholder="t('auth.passwordPlaceholder')"
          autocomplete="new-password"
          :required="true"
          :error="errors.newPassword"
        />
        <AppInput
          id="reset-confirm"
          v-model="form.confirmPassword"
          :label="t('auth.confirmNewPassword')"
          type="password"
          :placeholder="t('auth.confirmPasswordPlaceholder')"
          autocomplete="new-password"
          :required="true"
          :error="errors.confirmPassword"
        />
        <AppButton type="submit" :loading="loading" :block="true" size="lg">
          <span class="material-symbols-outlined" aria-hidden="true">lock_reset</span>
          {{ t('auth.resetPassword') }}
        </AppButton>
      </form>

      <footer class="auth-card__foot">
        <p>
          <NuxtLink to="/login" class="auth-card__switch">{{ t('auth.backToSignIn') }}</NuxtLink>
        </p>
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
