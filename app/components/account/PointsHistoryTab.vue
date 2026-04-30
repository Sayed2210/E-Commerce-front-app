<script setup lang="ts">
import type { PointTransaction } from '~/types/api'
import { usePoints } from '~/composables/usePoints'

const { t } = useI18n()
const { getBalance, getHistory } = usePoints()

const { data: balanceData } = await getBalance()
const balance = computed(() => balanceData.value?.balance ?? 0)

const { data: historyData, pending } = await getHistory()
const transactions = computed<PointTransaction[]>(() => historyData.value ?? [])

function typeClass(type: string) {
  return type === 'earn' ? 'transaction--earn' : 'transaction--redeem'
}

function typeLabel(type: string) {
  return type === 'earn' ? t('points.earned') : t('points.redeemed')
}
</script>

<template>
  <div>
    <h2 class="font-bold text-on-surface font-headline mb-6">{{ $t('account.pointsHistory') }}</h2>

    <div class="points-balance">
      <div class="points-balance__card">
        <span class="material-symbols-outlined points-balance__icon" aria-hidden="true">stars</span>
        <div>
          <p class="points-balance__label">{{ $t('points.currentBalance') }}</p>
          <p class="points-balance__value">{{ balance }}</p>
        </div>
      </div>
    </div>

    <div v-if="pending" class="points-loading">
      <div v-for="i in 4" :key="i" class="points-loading__skel" />
    </div>

    <AppEmptyState
      v-else-if="!transactions.length"
      icon="stars"
      :title="$t('points.noTransactions')"
      :body="$t('points.noTransactionsBody')"
    />

    <div v-else class="points-transactions">
      <div
        v-for="tx in transactions"
        :key="tx.id"
        class="points-transactions__item"
        :class="typeClass(tx.type)"
      >
        <div class="points-transactions__info">
          <span class="points-transactions__type">{{ typeLabel(tx.type) }}</span>
          <span v-if="tx.reason" class="points-transactions__reason">{{ tx.reason }}</span>
          <span class="points-transactions__date">{{
            new Date(tx.createdAt).toLocaleDateString()
          }}</span>
        </div>
        <div class="points-transactions__amount">
          <span
            :class="
              tx.type === 'earn'
                ? 'points-transactions__amount--earn'
                : 'points-transactions__amount--redeem'
            "
          >
            {{ tx.type === 'earn' ? '+' : '-' }}{{ tx.amount }}
          </span>
          <span class="points-transactions__balance">{{
            $t('points.balanceAfter', { balance: tx.balanceAfter })
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.points-balance {
  margin-bottom: 1.5rem;
}

.points-balance__card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: color-mix(in srgb, var(--color-primary-container) 30%, transparent);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
}

.points-balance__icon {
  font-size: 2rem;
  color: var(--color-primary);
}

.points-balance__label {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-secondary);
  margin: 0;
}

.points-balance__value {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.points-loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.points-loading__skel {
  height: 3.5rem;
  background: linear-gradient(
    90deg,
    var(--color-surface-container) 25%,
    var(--color-surface-container-lowest) 50%,
    var(--color-surface-container) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
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

.points-transactions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.points-transactions__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-DEFAULT);
  border-left: 3px solid var(--color-outline-variant);
}

.points-transactions__item.transaction--earn {
  border-left-color: var(--color-success);
}

.points-transactions__item.transaction--redeem {
  border-left-color: var(--color-primary);
}

.points-transactions__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.points-transactions__type {
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.points-transactions__reason {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--color-secondary);
}

.points-transactions__date {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--color-secondary);
}

.points-transactions__amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.points-transactions__amount--earn {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-success);
}

.points-transactions__amount--redeem {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
}

.points-transactions__balance {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--color-secondary);
}
</style>
