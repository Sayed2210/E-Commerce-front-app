<script setup lang="ts">
import type { ShippingZone, CreateShippingZoneDto } from '~/types/api'
import { useShippingZones } from '~/composables/admin/useShippingZones'

const { listShippingZones, createShippingZone, deleteShippingZone } = useShippingZones()

const zones = ref<ShippingZone[]>([])
const pending = ref(true)

async function fetchZones() {
  pending.value = true
  const { data, error } = await listShippingZones()
  if (!error && data) zones.value = data
  pending.value = false
}

await fetchZones()

const showCreate = ref(false)
const processingId = ref<string | null>(null)

const form = reactive<CreateShippingZoneDto>({
  name: '',
  countries: [],
  isActive: true,
})

const countryInput = ref('')

function addCountry() {
  const code = countryInput.value.trim().toUpperCase()
  if (code && !form.countries.includes(code)) {
    form.countries.push(code)
  }
  countryInput.value = ''
}

function removeCountry(code: string) {
  form.countries = form.countries.filter((c) => c !== code)
}

async function handleCreate() {
  const ok = await createShippingZone({ ...form })
  if (ok) {
    showCreate.value = false
    Object.assign(form, { name: '', countries: [], isActive: true })
    await fetchZones()
  }
}

async function handleDelete(id: string) {
  processingId.value = id
  const ok = await deleteShippingZone(id)
  if (ok) await fetchZones()
  processingId.value = null
}
</script>

<template>
  <section class="shipping-zones">
    <div class="shipping-zones__head">
      <h2 class="shipping-zones__title">{{ $t('admin.shipping.shippingZones') }}</h2>
      <button type="button" class="shipping-zones__create-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined" aria-hidden="true">{{
          showCreate ? 'close' : 'add'
        }}</span>
        {{ showCreate ? $t('common.cancel') : $t('admin.shipping.newZone') }}
      </button>
    </div>

    <div v-if="showCreate" class="shipping-form">
      <h3 class="shipping-form__title">{{ $t('admin.shipping.newZoneTitle') }}</h3>
      <form class="shipping-form__form" @submit.prevent="handleCreate">
        <div class="shipping-form__field">
          <label class="shipping-form__label">{{ $t('admin.shipping.zoneName') }}</label>
          <input
            v-model="form.name"
            type="text"
            class="shipping-form__input"
            required
            :placeholder="$t('admin.shipping.zoneNamePlaceholder')"
          />
        </div>
        <div class="shipping-form__field">
          <label class="shipping-form__label">{{ $t('admin.shipping.countries') }}</label>
          <div class="shipping-form__countries-input">
            <input
              v-model="countryInput"
              type="text"
              maxlength="2"
              class="shipping-form__input shipping-form__input--code"
              :placeholder="$t('admin.shipping.countryCodePlaceholder')"
              @keyup.enter.prevent="addCountry"
            />
            <button type="button" class="shipping-form__add-btn" @click="addCountry">
              {{ $t('common.add') }}
            </button>
          </div>
          <div v-if="form.countries.length" class="shipping-form__tags">
            <span v-for="code in form.countries" :key="code" class="shipping-form__tag">
              {{ code }}
              <button type="button" class="shipping-form__tag-remove" @click="removeCountry(code)">
                ×
              </button>
            </span>
          </div>
        </div>
        <label class="shipping-form__check">
          <input v-model="form.isActive" type="checkbox" />
          {{ $t('admin.shipping.active') }}
        </label>
        <div class="shipping-form__actions">
          <button type="submit" class="shipping-form__submit">
            {{ $t('admin.shipping.createZone') }}
          </button>
          <button type="button" class="shipping-form__cancel" @click="showCreate = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="pending" class="shipping-zones__loading">
      <div v-for="i in 3" :key="i" class="shipping-zones__skel" />
    </div>

    <AppEmptyState
      v-else-if="!zones.length"
      icon="local_shipping"
      :title="$t('admin.shipping.noZones')"
      :body="$t('admin.shipping.noZonesBody')"
    />

    <div v-else class="shipping-table__wrap">
      <table class="shipping-table">
        <thead>
          <tr>
            <th>{{ $t('admin.shipping.zoneName') }}</th>
            <th>{{ $t('admin.shipping.countries') }}</th>
            <th>{{ $t('admin.shipping.status') }}</th>
            <th>{{ $t('admin.shipping.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="z in zones" :key="z.id">
            <td class="shipping-table__name">{{ z.name }}</td>
            <td>
              <span v-for="code in z.countries" :key="code" class="shipping-table__country-tag">{{
                code
              }}</span>
            </td>
            <td>
              <span
                class="shipping-table__badge"
                :class="z.isActive ? 'badge--active' : 'badge--inactive'"
              >
                {{ z.isActive ? $t('admin.shipping.active') : $t('admin.shipping.inactive') }}
              </span>
            </td>
            <td>
              <button
                type="button"
                class="shipping-table__btn shipping-table__btn--delete"
                :disabled="processingId === z.id"
                @click="handleDelete(z.id)"
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
.shipping-zones__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.shipping-zones__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.shipping-zones__create-btn {
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

.shipping-zones__create-btn .material-symbols-outlined {
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

.shipping-form__input--code {
  width: auto;
  flex: 1;
}

.shipping-form__countries-input {
  display: flex;
  gap: 0.5rem;
}

.shipping-form__add-btn {
  padding: 0.625rem 1rem;
  background: var(--color-surface-container);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  cursor: pointer;
}

.shipping-form__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.shipping-form__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: var(--color-surface-container);
  border-radius: var(--radius-sm);
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-on-surface);
}

.shipping-form__tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-error);
  padding: 0;
  line-height: 1;
}

.shipping-form__check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
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

.shipping-zones__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shipping-zones__skel {
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

.shipping-table__name {
  font-family: var(--font-label);
  font-weight: 700;
}

.shipping-table__country-tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: var(--color-surface-container);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.shipping-table__badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.shipping-table__badge.badge--active {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.shipping-table__badge.badge--inactive {
  background: color-mix(in srgb, var(--color-error) 12%, transparent);
  color: var(--color-error);
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
