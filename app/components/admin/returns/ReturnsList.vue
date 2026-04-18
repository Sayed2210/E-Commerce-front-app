<script setup lang="ts">
import type { Return, ReturnStatus } from '~/types/api'
import { showSuccessToast, showErrorToast } from '~/utils/errorHandler'
import { getAccessToken } from '~/utils/token'

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl as string

function authH() {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const { data, pending, refresh } = await useFetch<Return[]>('/returns', {
  baseURL,
  headers: authH(),
})
const returns = computed<Return[]>(() => data.value ?? [])

const processingId = ref<string | null>(null)

const STATUS_CLASS: Record<ReturnStatus, string> = {
  pending: 'badge--pending',
  approved: 'badge--approved',
  rejected: 'badge--rejected',
  completed: 'badge--completed',
}

async function process(id: string, status: 'approved' | 'rejected') {
  processingId.value = id
  try {
    await $fetch(`${baseURL}/returns/${id}/process`, {
      method: 'PATCH',
      body: { status },
      headers: authH(),
    })
    showSuccessToast(`Return ${status}.`)
    await refresh()
  } catch (err) {
    showErrorToast(err)
  } finally {
    processingId.value = null
  }
}
</script>

<template>
  <section class="returns-list">
    <div class="returns-list__head">
      <h1 class="returns-list__title">Return Requests</h1>
    </div>

    <div v-if="pending" class="returns-list__loading" aria-busy="true">
      <div v-for="i in 4" :key="i" class="returns-list__skel" />
    </div>

    <AppEmptyState
      v-else-if="!returns.length"
      icon="assignment_return"
      title="No return requests"
      body="Return requests from customers will appear here."
    />

    <div v-else class="returns-list__table-wrap">
      <table class="returns-list__table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ret in returns" :key="ret.id">
            <td class="returns-list__cell--mono">
              <NuxtLink :to="`/admin/orders/${ret.orderId}`" class="returns-list__link">
                #{{ ret.orderId.slice(-8).toUpperCase() }}
              </NuxtLink>
            </td>
            <td class="returns-list__reason">{{ ret.reason.replace(/_/g, ' ') }}</td>
            <td>
              <span class="returns-list__badge" :class="STATUS_CLASS[ret.status]">
                {{ ret.status }}
              </span>
            </td>
            <td class="returns-list__date">
              {{ new Date(ret.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
            </td>
            <td>
              <div v-if="ret.status === 'pending'" class="returns-list__actions">
                <button
                  type="button"
                  class="returns-list__btn returns-list__btn--approve"
                  :disabled="processingId === ret.id"
                  @click="process(ret.id, 'approved')"
                >
                  Approve
                </button>
                <button
                  type="button"
                  class="returns-list__btn returns-list__btn--reject"
                  :disabled="processingId === ret.id"
                  @click="process(ret.id, 'rejected')"
                >
                  Reject
                </button>
              </div>
              <span v-else class="returns-list__resolved">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.returns-list__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.returns-list__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.returns-list__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.returns-list__skel {
  background: var(--color-surface-container-low);
  border-radius: var(--radius-DEFAULT);
  height: 3rem;
  animation: skel 1.6s ease-in-out infinite;
}

@keyframes skel { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.returns-list__table-wrap {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  overflow: auto;
}

.returns-list__table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 0.875rem;
}

.returns-list__table th {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--color-secondary);
  padding: 0.875rem 1.25rem;
  text-align: left;
  background: var(--color-surface-container-low);
}

.returns-list__table td {
  padding: 1rem 1.25rem;
  color: var(--color-on-surface);
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 10%, transparent);
  vertical-align: middle;
}

.returns-list__cell--mono {
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 0.8125rem;
}

.returns-list__link {
  color: var(--color-primary);
  text-decoration: none;
}

.returns-list__link:hover {
  text-decoration: underline;
}

.returns-list__reason {
  text-transform: capitalize;
  color: var(--color-secondary);
}

.returns-list__date {
  color: var(--color-secondary);
  font-size: 0.8125rem;
}

.returns-list__badge {
  display: inline-flex;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.badge--pending   { background: color-mix(in srgb, var(--color-secondary) 12%, transparent); color: var(--color-secondary); }
.badge--approved  { background: color-mix(in srgb, var(--color-tertiary) 12%, transparent); color: var(--color-tertiary); }
.badge--rejected  { background: var(--color-error-container); color: var(--color-on-error-container); }
.badge--completed { background: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary); }

.returns-list__actions {
  display: flex;
  gap: 0.5rem;
}

.returns-list__btn {
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-DEFAULT);
  transition: opacity var(--transition-fast);
}

.returns-list__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.returns-list__btn--approve {
  background: color-mix(in srgb, var(--color-tertiary) 15%, transparent);
  color: var(--color-tertiary);
}

.returns-list__btn--approve:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-tertiary) 25%, transparent);
}

.returns-list__btn--reject {
  background: var(--color-error-container);
  color: var(--color-on-error-container);
}

.returns-list__btn--reject:hover:not(:disabled) {
  opacity: 0.85;
}

.returns-list__resolved {
  color: var(--color-secondary);
}
</style>
