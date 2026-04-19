<script setup lang="ts">
import type { Coupon, CreateCouponDto } from '~/types/api'
import { useCoupons } from '~/composables/useCoupons'
import { getAccessToken } from '~/utils/token'

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl as string

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

const { data, pending, refresh } = await useFetch<Coupon[]>('/coupons', {
  baseURL,
  headers: authH(),
})
const coupons = computed<Coupon[]>(() => data.value ?? [])

const showCreate = ref(false)
const processingId = ref<string | null>(null)

const form = reactive<CreateCouponDto>({
  code: '',
  type: 'percentage',
  value: 0,
  minOrderValue: 0,
  startDate: new Date().toISOString().slice(0, 10),
  isActive: true,
})

const { handleCreate: create, toggleActive, deleteCoupon: remove } = useCoupons()

async function handleCreate() {
  await create(form, refresh)
  showCreate.value = false
}

async function handleToggle(coupon: Coupon) {
  await toggleActive(coupon, processingId, refresh)
}

async function handleDelete(id: string) {
  await remove(id, processingId, refresh)
}
</script>

<template>
  <section class="coupons-list">
    <div class="coupons-list__head">
      <h1 class="coupons-list__title">Coupons</h1>
      <button type="button" class="coupons-list__create-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined" aria-hidden="true">{{
          showCreate ? 'close' : 'add'
        }}</span>
        {{ showCreate ? 'Cancel' : 'New Coupon' }}
      </button>
    </div>

    <CouponForm
      v-if="showCreate"
      :form="form"
      @submit="handleCreate"
      @cancel="showCreate = false"
    />

    <div v-if="pending" class="coupons-list__loading">
      <div v-for="i in 4" :key="i" class="coupons-list__skel" />
    </div>

    <AppEmptyState
      v-else-if="!coupons.length"
      icon="local_offer"
      title="No coupons yet"
      body="Create your first discount coupon above."
    />

    <CouponTable
      v-else
      :coupons="coupons"
      :processing-id="processingId"
      @toggle="handleToggle"
      @delete="handleDelete"
    />
  </section>
</template>

<style scoped>
.coupons-list__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.coupons-list__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.coupons-list__create-btn {
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

.coupons-list__create-btn:hover {
  box-shadow: var(--shadow-btn-hover);
}

.coupons-list__create-btn .material-symbols-outlined {
  font-size: 1rem;
}

.coupons-list__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.coupons-list__skel {
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
</style>
