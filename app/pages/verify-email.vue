<script setup lang="ts">
const { t } = useI18n()

definePageMeta({ layout: false })
useSeoMeta({
  title: () => `${t('auth.verifyingEmail')} — ${t('brand.name')}`,
  robots: 'noindex, nofollow',
})

const { state, errorMessage } = useVerifyEmail()
const { resendVerification } = useAuth()
const resending = ref(false)
const resent = ref(false)

async function handleResend() {
  resending.value = true
  const ok = await resendVerification()
  resending.value = false
  if (ok) resent.value = true
}
</script>

<template>
  <AuthPageShell :label="t('auth.verifyingEmail')">
    <div v-if="state === 'loading'" class="ve-state" aria-live="polite" aria-busy="true">
      <div class="ve-spinner" aria-hidden="true">
        <span class="material-symbols-outlined ve-spinner__icon">autorenew</span>
      </div>
      <h1 class="auth-card__title">{{ t('auth.verifyingEmail') }}</h1>
      <p class="auth-card__sub">{{ t('auth.verifyWait') }}</p>
    </div>

    <div v-else-if="state === 'success'" class="ve-state" aria-live="polite">
      <div class="ve-icon-wrap ve-icon-wrap--success" aria-hidden="true">
        <span class="material-symbols-outlined ve-icon">verified</span>
      </div>
      <h1 class="auth-card__title">{{ t('auth.emailVerified') }}</h1>
      <p class="auth-card__sub">
        {{ t('auth.emailVerifiedSubtitle') }}
      </p>
      <NuxtLink to="/login" class="auth-btn-link">
        <span class="material-symbols-outlined" aria-hidden="true">login</span>
        {{ t('auth.signIn') }}
      </NuxtLink>
    </div>

    <div v-else-if="state === 'error'" class="ve-state" aria-live="assertive">
      <div class="ve-icon-wrap ve-icon-wrap--error" aria-hidden="true">
        <span class="material-symbols-outlined ve-icon">error</span>
      </div>
      <h1 class="auth-card__title">{{ t('auth.verificationFailed') }}</h1>
      <p class="auth-card__sub">{{ errorMessage }}</p>
      <div class="ve-actions">
        <NuxtLink to="/register" class="auth-btn-link auth-btn-link--secondary">
          {{ t('auth.createNewAccount') }}
        </NuxtLink>
        <NuxtLink to="/login" class="auth-btn-link">{{ t('auth.signIn') }}</NuxtLink>
      </div>
    </div>

    <div v-else-if="state === 'pending'" class="ve-state" aria-live="polite">
      <div class="ve-icon-wrap ve-icon-wrap--pending" aria-hidden="true">
        <span class="material-symbols-outlined ve-icon">mark_email_unread</span>
      </div>
      <h1 class="auth-card__title">{{ t('auth.checkYourEmail') }}</h1>
      <p class="auth-card__sub">
        {{ t('auth.verificationSent') }}
      </p>
      <p v-if="resent" class="ve-resent-msg">{{ t('auth.emailResent') }}</p>
      <button
        class="auth-btn-link auth-btn-link--secondary"
        :disabled="resending || resent"
        type="button"
        :aria-label="t('auth.resendEmail')"
        @click="handleResend"
      >
        <span class="material-symbols-outlined" aria-hidden="true">send</span>
        {{ resending ? t('auth.sending') : resent ? t('auth.sent') : t('auth.resendEmail') }}
      </button>
    </div>

    <div v-else class="ve-state" aria-live="polite">
      <div class="ve-icon-wrap ve-icon-wrap--error" aria-hidden="true">
        <span class="material-symbols-outlined ve-icon">link_off</span>
      </div>
      <h1 class="auth-card__title">{{ t('auth.invalidLink') }}</h1>
      <p class="auth-card__sub">
        {{ t('auth.missingToken') }}
      </p>
      <NuxtLink to="/register" class="auth-btn-link">{{ t('auth.registerAgain') }}</NuxtLink>
    </div>
  </AuthPageShell>
</template>

<style scoped>
.ve-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
}

.ve-spinner {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-full);
  background: var(--color-surface-container-low);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.ve-spinner__icon {
  font-size: 2rem;
  color: var(--color-primary);
  animation: ve-spin 1s linear infinite;
}

@keyframes ve-spin {
  to {
    transform: rotate(360deg);
  }
}

.ve-icon-wrap {
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.ve-icon-wrap--success {
  background: var(--color-primary-fixed);
}

.ve-icon-wrap--pending {
  background: var(--color-secondary-container, #e8def8);
}

.ve-icon-wrap--pending .ve-icon {
  color: var(--color-secondary, #625b71);
}

.ve-icon-wrap--error {
  background: var(--color-error-container);
}

.ve-icon {
  font-size: 2rem;
}

.ve-icon-wrap--success .ve-icon {
  color: var(--color-primary);
}

.ve-icon-wrap--error .ve-icon {
  color: var(--color-on-error-container);
}

.ve-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.ve-resent-msg {
  font-size: 0.875rem;
  color: var(--color-primary);
}
</style>
