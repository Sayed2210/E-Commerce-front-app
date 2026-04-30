<script setup lang="ts">
import type { ShippingRate, CreateShippingRateDto } from '~/types/api'
import { useShippingRates } from '~/composables/admin/useShippingRates'

const { listShippingRates, createShippingRate, deleteShippingRate } = useShippingRates()

const { data, pending, refresh } = await listShippingRates()
const rates = computed<ShippingRate[]>(() => data.value ?? [])

const showCreate = ref(false)
const processingId = ref<string | null>(null)

const form = reactive<CreateShippingRateDto>({
  shippingZoneId: '',
  minWeight: 0,
  maxWeight: 5,
  baseCost: 5,
  perKgCost: 1,
  freeShippingThreshold: 100,
})

async function handleCreate() {
  const ok = await createShippingRate({ ...form })
  if (ok) {
    showCreate.value = false
    Object.assign(form, {
      shippingZoneId: '',
      minWeight: 0,
      maxWeight: 5,
      baseCost: 5,
      perKgCost: 1,
      freeShippingThreshold: 100,
    })
    await refresh()
  }
}

async function handleDelete(id: string) {
  processingId.value = id
  const ok = await deleteShippingRate(id)
  if (ok) await refresh()
  processingId.value = null
}
</script>

<template>
  <section class="shipping-rates">
    <div class="shipping-rates__head">
      <h2 class="shipping-rates__title">{{ $t('admin.shipping.shippingRates') }}</h2>
      <button type="button" class="shipping-rates__create-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined" aria-hidden="true">{{
          showCreate ? 'close' : 'add'
        }}</span>
        {{ showCreate ? $t('common.cancel') : $t('admin.shipping.newRate') }}
      </button>
    </div>

    <div v-if="showCreate" class="shipping-form">
      <h3 class="shipping-form__title">{{ $t('admin.shipping.newRateTitle') }}</h3>
      <form class="shipping-form__form" @submit.prevent="handleCreate">
        <div class="shipping-form__row">
          <div class="shipping-form__field">
            <label class="shipping-form__label">{{ $t('admin.shipping.zoneId') }}</label>
            <input
              v-model="form.shippingZoneId"
              type="text"
              class="shipping-form__input"
              required
              :placeholder="$t('admin.shipping.zoneIdPlaceholder')"
            />
          </div>
          <div class="shipping-form__field">
            <label class="shipping-form__label">{{ $t('admin.shipping.minWeight') }}</label>
            <input
              v-model.number="form.minWeight"
              type="number"
              min="0"
              step="0.1"
              class="shipping-form__input"
              required
            />
          </div>
          <div class="shipping-form__field">
            <label class="shipping-form__label">{{ $t('admin.shipping.maxWeight') }}</label>
            <input
              v-model.number="form.maxWeight"
              type="number"
              min="0"
              step="0.1"
              class="shipping-form__input"
              required
            />
          </div>
        </div>
        <div class="shipping-form__row">
          <div class="shipping-form__field">
            <label class="shipping-form__label">{{ $t('admin.shipping.baseCost') }}</label>
            <input
              v-model.number="form.baseCost"
              type="number"
              min="0"
              step="0.01"
              class="shipping-form__input"
              required
            />
          </div>
          <div class="shipping-form__field">
            <label class="shipping-form__label">{{ $t('admin.shipping.perKgCost') }}</label>
            <input
              v-model.number="form.perKgCost"
              type="number"
              min="0"
              step="0.01"
              class="shipping-form__input"
              required
            />
          </div>
          <div class="shipping-form__field">
            <label class="shipping-form__label">{{
              $t('admin.shipping.freeShippingThreshold')
            }}</label>
            <input
              v-model.number="form.freeShippingThreshold"
              type="number"
              min="0"
              step="0.01"
              class="shipping-form__input"
            />
          </div>
        </div>
        <div class="shipping-form__actions">
          <button type="submit" class="shipping-form__submit">
            {{ $t('admin.shipping.createRate') }}
          </button>
          <button type="button" class="shipping-form__cancel" @click="showCreate = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="pending" class="shipping-rates__loading">
      <div v-for="i in 3" :key="i" class="shipping-rates__skel" />
    </div>

    <AppEmptyState
      v-else-if="!rates.length"
      icon="scale"
      :title="$t('admin.shipping.noRates')"
      :body="$t('admin.shipping.noRatesBody')"
    />

    <div v-else class="shipping-table__wrap">
      <table class="shipping-table">
        <thead>
          <tr>
            <th>{{ $t('admin.shipping.zoneId') }}</th>
            <th>{{ $t('admin.shipping.weightRange') }}</th>
            <th>{{ $t('admin.shipping.baseCost') }}</th>
            <th>{{ $t('admin.shipping.perKgCost') }}</th>
            <th>{{ $t('admin.shipping.freeThreshold') }}</th>
            <th>{{ $t('admin.shipping.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rates" :key="r.id">
            <td class="shipping-table__zone">{{ r.shippingZoneId }}</td>
            <td>{{ r.minWeight }} - {{ r.maxWeight }} kg</td>
            <td>${{ r.baseCost.toFixed(2) }}</td>
            <td>${{ r.perKgCost.toFixed(2) }}</td>
            <td>${{ r.freeShippingThreshold.toFixed(2) }}</td>
            <td>
              <button
                type="button"
                class="shipping-table__btn shipping-table__btn--delete"
                :disabled="processingId === r.id"
                @click="handleDelete(r.id)"
              >
                {{ $t('common.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.shipping-rates__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.shipping-rates__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.shipping-rates__create-btn {
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

.shipping-rates__create-btn .material-symbols-outlined {
  font-size: 1rem;
}

.shipping-form {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.shipping-form__title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.shipping-form__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shipping-form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
}

.shipping-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.shipping-form__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.shipping-form__input {
  background: var(--color-surface-container);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.shipping-form__input:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.shipping-form__actions {
  display: flex;
  gap: 0.75rem;
}

.shipping-form__submit {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
}

.shipping-form__cancel {
  padding: 0.625rem 1.25rem;
  background: none;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-secondary);
  cursor: pointer;
}

.shipping-rates__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shipping-rates__skel {
  height: 3rem;
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

.shipping-table__wrap {
  overflow-x: auto;
}

.shipping-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.shipping-table thead {
  background: var(--color-surface-container);
}

.shipping-table thead th {
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: var(--color-secondary);
}

.shipping-table tbody td {
  padding: 1rem;
  border-top: 1px solid var(--color-outline-variant);
}

.shipping-table__zone {
  font-family: var(--font-label);
  font-weight: 700;
}

.shipping-table__btn {
  padding: 0.375rem 0.75rem;
  background: none;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  color: var(--color-error);
}

.shipping-table__btn:hover:not(:disabled) {
  background: var(--color-surface-container-low);
}

.shipping-table__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
