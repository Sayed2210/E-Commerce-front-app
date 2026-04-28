<script setup lang="ts">
import type { SendCampaignDto } from '~/types/api'
import { useNewsletterAdmin } from '~/composables/useNewsletterAdmin'

const { getStats, sendCampaign } = useNewsletterAdmin()

const { data: stats } = getStats()

const showSend = ref(false)
const sending = ref(false)

const form = reactive<SendCampaignDto>({
  subject: '',
  content: '',
  recipientFilter: 'all',
})

async function handleSend() {
  sending.value = true
  const { error } = await sendCampaign(form)
  if (!error) {
    showSend.value = false
    form.subject = ''
    form.content = ''
    form.recipientFilter = 'all'
  }
  sending.value = false
}
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader :title="$t('admin.newsletterPage.title')">
      <button type="button" class="admin-btn" @click="showSend = !showSend">
        <span class="material-symbols-outlined text-sm">{{ showSend ? 'close' : 'send' }}</span>
        {{ showSend ? $t('admin.newsletterPage.cancel') : $t('admin.newsletterPage.sendCampaign') }}
      </button>
    </AdminPageHeader>

    <AdminFormPanel v-if="showSend">
      <form class="space-y-4" @submit.prevent="handleSend">
        <div class="form__field">
          <label class="form__label">{{ $t('admin.newsletterPage.subject') }}</label>
          <input
            v-model="form.subject"
            type="text"
            class="form__input"
            :placeholder="$t('admin.newsletterPage.subjectPlaceholder')"
            required
          />
        </div>
        <div class="form__field">
          <label class="form__label">{{ $t('admin.newsletterPage.recipients') }}</label>
          <select v-model="form.recipientFilter" class="form__input">
            <option value="all">{{ $t('admin.newsletterPage.allSubscribers') }}</option>
            <option value="active">{{ $t('admin.newsletterPage.activeSubscribers') }}</option>
            <option value="inactive">{{ $t('admin.newsletterPage.inactiveSubscribers') }}</option>
          </select>
        </div>
        <div class="form__field">
          <label class="form__label">{{ $t('admin.newsletterPage.contentHtml') }}</label>
          <textarea
            v-model="form.content"
            class="form__textarea"
            rows="6"
            :placeholder="$t('admin.newsletterPage.contentPlaceholder')"
            required
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="admin-btn" :disabled="sending">
            {{ sending ? $t('admin.newsletterPage.sending') : $t('admin.newsletterPage.send') }}
          </button>
        </div>
      </form>
    </AdminFormPanel>

    <div class="newsletter-stats">
      <h3 class="subtitle">{{ $t('admin.newsletterPage.subscriberStats') }}</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ stats?.totalSubscribers ?? 0 }}</span>
          <span class="stat-label">{{ $t('admin.newsletterPage.total') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats?.activeSubscribers ?? 0 }}</span>
          <span class="stat-label">{{ $t('admin.newsletterPage.active') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats?.unsubscribed ?? 0 }}</span>
          <span class="stat-label">{{ $t('admin.newsletterPage.unsubscribed') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-DEFAULT);
  padding: 0.625rem 1.25rem;
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
}

.admin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form__label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
}

.form__input,
.form__textarea {
  width: 100%;
  background: var(--color-surface-container);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
}

.form__textarea {
  resize: vertical;
}

.subtitle {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
  margin-top: 0.25rem;
}
</style>
