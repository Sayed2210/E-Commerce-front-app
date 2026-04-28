<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ layout: false, middleware: 'guest' })
useSeoMeta({
  title: () => `${t('auth.forgotTitle')} — ${t('brand.name')}`,
  robots: 'noindex, nofollow',
})

const { form, errors, loading, submitted, serverError, handleSubmit } = useForgotPassword()
</script>

<template>
  <AuthPageShell :label="t('auth.forgotTitle')">
    <template v-if="submitted">
      <div class="fp-success">
        <div class="fp-success__icon-wrap" aria-hidden="true">
          <span class="material-symbols-outlined fp-success__icon">mark_email_read</span>
        </div>
        <h1 class="auth-card__title">{{ t('auth.checkInbox') }}</h1>
        <p class="auth-card__sub" v-html="t('auth.resetLinkSent', { email: form.email })" />
        <NuxtLink to="/login" class="fp-success__back">
          <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          {{ t('auth.backToSignIn') }}
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <header class="auth-card__head">
        <div class="auth-card__icon-wrap" aria-hidden="true">
          <span class="material-symbols-outlined auth-card__icon">lock_reset</span>
        </div>
        <h1 class="auth-card__title">{{ t('auth.forgotTitle') }}</h1>
        <p class="auth-card__sub">{{ t('auth.forgotSubtitle') }}</p>
      </header>

      <div v-if="serverError" class="auth-alert" role="alert" aria-live="assertive">
        <span class="material-symbols-outlined auth-alert__icon" aria-hidden="true">error</span>
        {{ serverError }}
      </div>

      <form
        class="auth-form"
        novalidate
        :aria-label="t('auth.forgotTitle')"
        @submit.prevent="handleSubmit"
      >
        <AppInput
          id="forgot-email"
          v-model="form.email"
          :label="t('auth.emailAddress')"
          type="email"
          :placeholder="t('auth.emailPlaceholder')"
          autocomplete="email"
          :required="true"
          :error="errors.email"
        />
        <AppButton type="submit" :loading="loading" :block="true" size="lg">
          <span class="material-symbols-outlined" aria-hidden="true">send</span>
          {{ t('auth.sendResetLink') }}
        </AppButton>
      </form>

      <footer class="auth-card__foot">
        <p>
          {{ t('auth.rememberPassword') }}
          <NuxtLink to="/login" class="auth-card__switch">{{ t('auth.signIn') }}</NuxtLink>
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
