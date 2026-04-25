<script setup lang="ts">
import type { SendCampaignDto } from '~/types/api'
import { useNewsletterAdmin } from '~/composables/useNewsletterAdmin'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Newsletter — Admin' })

const { getStats, sendCampaign } = useNewsletterAdmin()

const { data: stats, pending: statsPending } = getStats()

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
  <section class="newsletter">
    <div class="newsletter__head">
      <h1 class="newsletter__title">Newsletter</h1>
      <button type="button" class="newsletter__send-btn" @click="showSend = !showSend">
        <span class="material-symbols-outlined" aria-hidden="true">{{
          showSend ? 'close' : 'send'
        }}</span>
        {{ showSend ? 'Cancel' : 'Send Campaign' }}
      </button>
    </div>

    <div v-if="showSend" class="newsletter__form">
      <form class="form" @submit.prevent="handleSend">
        <div class="form__field">
          <label class="form__label">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            class="form__input"
            placeholder="Email subject line"
            required
          />
        </div>
        <div class="form__field">
          <label class="form__label">Recipients</label>
          <select v-model="form.recipientFilter" class="form__select">
            <option value="all">All subscribers</option>
            <option value="active">Active subscribers only</option>
            <option value="inactive">Inactive subscribers</option>
          </select>
        </div>
        <div class="form__field">
          <label class="form__label">Content (HTML)</label>
          <textarea
            v-model="form.content"
            class="form__textarea"
            rows="6"
            placeholder="<p>Your email content...</p>"
            required
          />
        </div>
        <div class="form__actions">
          <button type="submit" class="form__submit" :disabled="sending">
            {{ sending ? 'Sending...' : 'Send Campaign' }}
          </button>
        </div>
      </form>
    </div>

    <div class="newsletter__stats">
      <h2 class="newsletter__subtitle">Subscriber Stats</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-card__value">{{ stats?.totalSubscribers ?? 0 }}</span>
          <span class="stat-card__label">Total</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">{{ stats?.activeSubscribers ?? 0 }}</span>
          <span class="stat-card__label">Active</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">{{ stats?.unsubscribed ?? 0 }}</span>
          <span class="stat-card__label">Unsubscribed</span>
        </div>
      </div>
    </div>

    <div v-if="statsPending" class="newsletter__loading">
      <div v-for="i in 3" :key="i" class="newsletter__skel" />
    </div>
  </section>
</template>

<style scoped>
.newsletter__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.newsletter__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.newsletter__send-btn {
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
  transition: box-shadow var(--transition-base);
}

.newsletter__send-btn:hover {
  box-shadow: var(--shadow-btn-hover);
}

.newsletter__form {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form__field {
  margin-bottom: 1rem;
}

.form__label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
  margin-bottom: 0.375rem;
}

.form__input,
.form__select,
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

.form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.form__submit {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}

.newsletter__stats {
  margin-bottom: 1.5rem;
}

.newsletter__subtitle {
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

.stat-card__value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.stat-card__label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
  margin-top: 0.25rem;
}

.newsletter__loading {
  display: flex;
  gap: 1rem;
}

.newsletter__skel {
  flex: 1;
  height: 80px;
  background: linear-gradient(
    90deg,
    var(--color-surface-container) 25%,
    var(--color-surface-container-lowest) 50%,
    var(--color-surface-container) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-md);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
