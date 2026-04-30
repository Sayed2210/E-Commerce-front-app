<script setup lang="ts">
import type { Currency, CreateCurrencyDto } from '~/types/api'
import { useCurrencies } from '~/composables/useCurrencies'

const { listCurrencies, createCurrency, deleteCurrency, setDefaultCurrency } = useCurrencies()

const { data, pending, refresh } = await listCurrencies()
const currencies = computed<Currency[]>(() => data.value ?? [])

const showCreate = ref(false)
const processingCode = ref<string | null>(null)

const form = reactive<CreateCurrencyDto>({
  code: '',
  name: '',
  symbol: '',
  exchangeRate: 1,
  isActive: true,
})

async function handleCreate() {
  const ok = await createCurrency({ ...form })
  if (ok) {
    showCreate.value = false
    Object.assign(form, {
      code: '',
      name: '',
      symbol: '',
      exchangeRate: 1,
      isActive: true,
    })
    await refresh()
  }
}

async function handleDelete(code: string) {
  processingCode.value = code
  const ok = await deleteCurrency(code)
  if (ok) await refresh()
  processingCode.value = null
}

async function handleSetDefault(code: string) {
  processingCode.value = code
  const ok = await setDefaultCurrency(code)
  if (ok) await refresh()
  processingCode.value = null
}

function formatRate(rate: number) {
  return rate.toFixed(4)
}
</script>

<template>
  <section class="currencies-list">
    <div class="currencies-list__head">
      <h1 class="currencies-list__title">{{ $t('admin.currenciesPage.title') }}</h1>
      <button type="button" class="currencies-list__create-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined" aria-hidden="true">{{
          showCreate ? 'close' : 'add'
        }}</span>
        {{ showCreate ? $t('common.cancel') : $t('admin.currenciesPage.newCurrency') }}
      </button>
    </div>

    <div v-if="showCreate" class="currency-form">
      <h2 class="currency-form__title">{{ $t('admin.currenciesPage.newCurrencyTitle') }}</h2>
      <form class="currency-form__form" @submit.prevent="handleCreate">
        <div class="currency-form__row">
          <div class="currency-form__field">
            <label class="currency-form__label">{{ $t('admin.currenciesPage.code') }}</label>
            <input
              v-model="form.code"
              type="text"
              class="currency-form__input"
              required
              maxlength="3"
              :placeholder="$t('admin.currenciesPage.codePlaceholder')"
            />
          </div>
          <div class="currency-form__field">
            <label class="currency-form__label">{{ $t('admin.currenciesPage.name') }}</label>
            <input
              v-model="form.name"
              type="text"
              class="currency-form__input"
              required
              :placeholder="$t('admin.currenciesPage.namePlaceholder')"
            />
          </div>
          <div class="currency-form__field">
            <label class="currency-form__label">{{ $t('admin.currenciesPage.symbol') }}</label>
            <input
              v-model="form.symbol"
              type="text"
              class="currency-form__input"
              required
              :placeholder="$t('admin.currenciesPage.symbolPlaceholder')"
            />
          </div>
          <div class="currency-form__field">
            <label class="currency-form__label">{{
              $t('admin.currenciesPage.exchangeRate')
            }}</label>
            <input
              v-model.number="form.exchangeRate"
              type="number"
              step="0.0001"
              min="0.0001"
              class="currency-form__input"
              required
              :placeholder="$t('admin.currenciesPage.ratePlaceholder')"
            />
          </div>
        </div>
        <label class="currency-form__check">
          <input v-model="form.isActive" type="checkbox" />
          {{ $t('admin.currenciesPage.active') }}
        </label>
        <div class="currency-form__actions">
          <button type="submit" class="currency-form__submit">
            {{ $t('admin.currenciesPage.createCurrency') }}
          </button>
          <button type="button" class="currency-form__cancel" @click="showCreate = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="pending" class="currencies-list__loading">
      <div v-for="i in 4" :key="i" class="currencies-list__skel" />
    </div>

    <AppEmptyState
      v-else-if="!currencies.length"
      icon="payments"
      :title="$t('admin.currenciesPage.noCurrencies')"
      :body="$t('admin.currenciesPage.noCurrenciesBody')"
    />

    <div v-else class="currency-table__wrap">
      <table class="currency-table">
        <thead>
          <tr>
            <th>{{ $t('admin.currenciesPage.code') }}</th>
            <th>{{ $t('admin.currenciesPage.name') }}</th>
            <th>{{ $t('admin.currenciesPage.symbol') }}</th>
            <th>{{ $t('admin.currenciesPage.exchangeRate') }}</th>
            <th>{{ $t('admin.currenciesPage.status') }}</th>
            <th>{{ $t('admin.currenciesPage.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in currencies" :key="c.code">
            <td class="currency-table__code">
              {{ c.code }}
              <span v-if="c.isDefault" class="currency-table__default-badge">
                {{ $t('admin.currenciesPage.default') }}
              </span>
            </td>
            <td>{{ c.name }}</td>
            <td>{{ c.symbol }}</td>
            <td>{{ formatRate(c.exchangeRate) }}</td>
            <td>
              <span
                class="currency-table__badge"
                :class="c.isActive ? 'badge--active' : 'badge--inactive'"
              >
                {{
                  c.isActive
                    ? $t('admin.currenciesPage.active')
                    : $t('admin.currenciesPage.inactive')
                }}
              </span>
            </td>
            <td>
              <div class="currency-table__actions">
                <button
                  v-if="!c.isDefault"
                  type="button"
                  class="currency-table__btn currency-table__btn--default"
                  :disabled="processingCode === c.code"
                  @click="handleSetDefault(c.code)"
                >
                  {{ $t('admin.currenciesPage.setDefault') }}
                </button>
                <button
                  type="button"
                  class="currency-table__btn currency-table__btn--delete"
                  :disabled="processingCode === c.code || c.isDefault"
                  @click="handleDelete(c.code)"
                >
                  {{ $t('admin.currenciesPage.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.currencies-list__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.currencies-list__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.currencies-list__create-btn {
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

.currencies-list__create-btn:hover {
  box-shadow: var(--shadow-btn-hover);
}

.currencies-list__create-btn .material-symbols-outlined {
  font-size: 1rem;
}

.currencies-list__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.currencies-list__skel {
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

.currency-form {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.currency-form__title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.currency-form__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.currency-form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
}

.currency-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.currency-form__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.currency-form__input {
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

.currency-form__input:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.currency-form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.currency-form__check input[type='checkbox'] {
  cursor: pointer;
}

.currency-form__actions {
  display: flex;
  gap: 0.75rem;
}

.currency-form__submit {
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow var(--transition-base);
}

.currency-form__submit:hover {
  box-shadow: var(--shadow-btn-hover);
}

.currency-form__cancel {
  padding: 0.625rem 1.25rem;
  background: none;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-secondary);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.currency-form__cancel:hover {
  background: var(--color-surface-container-low);
}

.currency-table__wrap {
  overflow-x: auto;
}

.currency-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.currency-table thead {
  background: var(--color-surface-container);
}

.currency-table thead th {
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: var(--color-secondary);
}

.currency-table tbody td {
  padding: 1rem;
  border-top: 1px solid var(--color-outline-variant);
}

.currency-table__code {
  font-family: var(--font-label);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.currency-table__default-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.currency-table__badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.currency-table__badge.badge--active {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.currency-table__badge.badge--inactive {
  background: color-mix(in srgb, var(--color-error) 12%, transparent);
  color: var(--color-error);
}

.currency-table__actions {
  display: flex;
  gap: 0.5rem;
}

.currency-table__btn {
  padding: 0.375rem 0.75rem;
  background: none;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
}

.currency-table__btn--default {
  color: var(--color-primary);
}

.currency-table__btn--delete {
  color: var(--color-error);
}

.currency-table__btn:hover:not(:disabled) {
  background: var(--color-surface-container-low);
}

.currency-table__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
