<script setup lang="ts">
import type { PointRedemption, CreatePointRedemptionDto } from '~/types/api'
import { usePointRedemptions } from '~/composables/admin/usePointRedemptions'

const { t } = useI18n()
const { listPointRedemptions, createPointRedemption, deletePointRedemption } = usePointRedemptions()

const { data, pending, refresh } = await listPointRedemptions()
const redemptions = computed<PointRedemption[]>(() => data.value ?? [])

const showCreate = ref(false)
const processingId = ref<string | null>(null)

const form = reactive<CreatePointRedemptionDto>({
  type: 'discount',
  pointsRequired: 100,
  value: 5,
  isActive: true,
})

async function handleCreate() {
  const ok = await createPointRedemption({ ...form })
  if (ok) {
    showCreate.value = false
    Object.assign(form, {
      type: 'discount',
      pointsRequired: 100,
      value: 5,
      isActive: true,
    })
    await refresh()
  }
}

async function handleDelete(id: string) {
  processingId.value = id
  const ok = await deletePointRedemption(id)
  if (ok) await refresh()
  processingId.value = null
}

function typeLabel(type: string) {
  return t(`admin.loyalty.${type}`) || type.replace(/_/g, ' ')
}
</script>

<template>
  <section class="point-redemptions">
    <div class="point-redemptions__head">
      <h2 class="point-redemptions__title">{{ $t('admin.loyalty.redemptionOptions') }}</h2>
      <button type="button" class="point-redemptions__create-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined" aria-hidden="true">{{
          showCreate ? 'close' : 'add'
        }}</span>
        {{ showCreate ? $t('common.cancel') : $t('admin.loyalty.newRedemption') }}
      </button>
    </div>

    <div v-if="showCreate" class="point-form">
      <h3 class="point-form__title">{{ $t('admin.loyalty.newRedemptionTitle') }}</h3>
      <form class="point-form__form" @submit.prevent="handleCreate">
        <div class="point-form__row">
          <div class="point-form__field">
            <label class="point-form__label">{{ $t('admin.loyalty.redemptionType') }}</label>
            <select v-model="form.type" class="point-form__input">
              <option value="discount">{{ $t('admin.loyalty.discount') }}</option>
              <option value="free_shipping">{{ $t('admin.loyalty.freeShipping') }}</option>
              <option value="free_order">{{ $t('admin.loyalty.freeOrder') }}</option>
            </select>
          </div>
          <div class="point-form__field">
            <label class="point-form__label">{{ $t('admin.loyalty.pointsRequired') }}</label>
            <input
              v-model.number="form.pointsRequired"
              type="number"
              min="1"
              class="point-form__input"
              required
            />
          </div>
          <div class="point-form__field">
            <label class="point-form__label">{{ $t('admin.loyalty.value') }}</label>
            <input
              v-model.number="form.value"
              type="number"
              min="0"
              step="0.01"
              class="point-form__input"
              required
            />
          </div>
        </div>
        <label class="point-form__check">
          <input v-model="form.isActive" type="checkbox" />
          {{ $t('admin.loyalty.active') }}
        </label>
        <div class="point-form__actions">
          <button type="submit" class="point-form__submit">
            {{ $t('admin.loyalty.createRedemption') }}
          </button>
          <button type="button" class="point-form__cancel" @click="showCreate = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="pending" class="point-redemptions__loading">
      <div v-for="i in 3" :key="i" class="point-redemptions__skel" />
    </div>

    <AppEmptyState
      v-else-if="!redemptions.length"
      icon="redeem"
      :title="$t('admin.loyalty.noRedemptions')"
      :body="$t('admin.loyalty.noRedemptionsBody')"
    />

    <div v-else class="point-table__wrap">
      <table class="point-table">
        <thead>
          <tr>
            <th>{{ $t('admin.loyalty.redemptionType') }}</th>
            <th>{{ $t('admin.loyalty.pointsRequired') }}</th>
            <th>{{ $t('admin.loyalty.value') }}</th>
            <th>{{ $t('admin.loyalty.status') }}</th>
            <th>{{ $t('admin.loyalty.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in redemptions" :key="r.id">
            <td class="point-table__type">{{ typeLabel(r.type) }}</td>
            <td>{{ r.pointsRequired }}</td>
            <td>{{ r.value }}</td>
            <td>
              <span
                class="point-table__badge"
                :class="r.isActive ? 'badge--active' : 'badge--inactive'"
              >
                {{ r.isActive ? $t('admin.loyalty.active') : $t('admin.loyalty.inactive') }}
              </span>
            </td>
            <td>
              <button
                type="button"
                class="point-table__btn point-table__btn--delete"
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
.point-redemptions__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.point-redemptions__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.point-redemptions__create-btn {
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

.point-redemptions__create-btn .material-symbols-outlined {
  font-size: 1rem;
}

.point-form {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.point-form__title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1rem;
}

.point-form__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.point-form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
}

.point-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.point-form__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.point-form__input {
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

.point-form__input:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.point-form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.point-form__actions {
  display: flex;
  gap: 0.75rem;
}

.point-form__submit {
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

.point-form__cancel {
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

.point-redemptions__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.point-redemptions__skel {
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

.point-table__wrap {
  overflow-x: auto;
}

.point-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.point-table thead {
  background: var(--color-surface-container);
}

.point-table thead th {
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: var(--color-secondary);
}

.point-table tbody td {
  padding: 1rem;
  border-top: 1px solid var(--color-outline-variant);
}

.point-table__type {
  text-transform: capitalize;
}

.point-table__badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.point-table__badge.badge--active {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.point-table__badge.badge--inactive {
  background: color-mix(in srgb, var(--color-error) 12%, transparent);
  color: var(--color-error);
}

.point-table__btn {
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

.point-table__btn:hover:not(:disabled) {
  background: var(--color-surface-container-low);
}

.point-table__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
