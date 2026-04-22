<script setup lang="ts">
import { useReturns } from '~/composables/useReturns'
import type { ReturnReason } from '~/types/api'

definePageMeta({ layout: 'default', middleware: 'auth' })
useSeoMeta({ title: 'Order Details — ArchitectMarket', robots: 'noindex, nofollow' })

const route = useRoute()
const id = route.params.id as string

const { getOrder } = useOrders()
const { createReturn } = useReturns()

useSeoMeta({ title: `Order Details — ArchitectMarket` })

const { data: order, pending, error, refresh: refreshOrder } = await getOrder(id)

const { $orderSocket } = useNuxtApp()
watch(
  () => $orderSocket.lastOrderUpdate.value,
  (updated) => {
    if (updated?.id === id) refreshOrder()
  }
)

const returnModal = reactive({
  open: false,
  itemId: '',
  reason: 'changed_mind' as ReturnReason,
  notes: '',
  loading: false,
})

const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'defective', label: 'Item is defective' },
  { value: 'wrong_item', label: 'Wrong item received' },
  { value: 'not_as_described', label: 'Not as described' },
]

function openReturn(itemId: string) {
  returnModal.itemId = itemId
  returnModal.open = true
}

async function submitReturn() {
  if (!order.value) return
  returnModal.loading = true
  await createReturn({
    orderId: order.value.id,
    orderItemId: returnModal.itemId,
    reason: returnModal.reason,
    notes: returnModal.notes || undefined,
  })
  returnModal.loading = false
  returnModal.open = false
}

const canReturn = computed(() => order.value?.status === 'delivered')

const shippingAddr = computed(() => order.value?.shippingAddress)

const breadcrumbs = computed(() => [
  { label: 'Marketplace', to: '/' },
  { label: 'My Orders', to: '/orders' },
  { label: `#${id.slice(-8).toUpperCase()}` },
])
</script>

<template>
  <div class="order-detail">
    <AppBreadcrumb :items="breadcrumbs" />

    <div v-if="pending" class="order-detail__skeleton" aria-busy="true" aria-label="Loading order">
      <div v-for="i in 4" :key="i" class="order-detail__skel-line" />
    </div>

    <AppEmptyState
      v-else-if="error || !order"
      icon="error"
      title="Order not found"
      body="We couldn't load this order."
    >
      <template #cta>
        <NuxtLink to="/orders" class="order-detail__back">Back to Orders</NuxtLink>
      </template>
    </AppEmptyState>

    <template v-else>
      <OrdersOrderHeader :order="order" class="order-detail__header" />

      <div class="order-detail__body">
        <div class="order-detail__main">
          <div class="order-detail__card">
            <OrdersOrderLineItems
              :items="order.items"
              :can-return="canReturn"
              @request-return="openReturn"
            />
          </div>

          <div v-if="shippingAddr" class="order-detail__card">
            <h2 class="order-detail__section-title">Shipping Address</h2>
            <address class="order-detail__address">
              <span
                v-if="shippingAddr.firstName || shippingAddr.lastName"
                class="order-detail__addr-name"
              >
                {{ [shippingAddr.firstName, shippingAddr.lastName].filter(Boolean).join(' ') }}
              </span>
              {{ shippingAddr.streetAddress }}, {{ shippingAddr.city }},
              {{ shippingAddr.state }}
              {{ shippingAddr.postalCode }},
              {{ shippingAddr.country }}
            </address>
          </div>
        </div>

        <aside class="order-detail__sidebar">
          <div class="order-detail__card">
            <OrdersOrderTotals :order="order" />
          </div>
        </aside>
      </div>
    </template>

    <Teleport to="body">
      <div
        v-if="returnModal.open"
        class="return-modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Request return"
      >
        <div class="return-modal">
          <h2 class="return-modal__title">Request Return</h2>

          <label class="return-modal__label" for="return-reason">Reason</label>
          <select id="return-reason" v-model="returnModal.reason" class="return-modal__select">
            <option v-for="r in RETURN_REASONS" :key="r.value" :value="r.value">
              {{ r.label }}
            </option>
          </select>

          <label class="return-modal__label" for="return-notes">Additional Notes</label>
          <textarea
            id="return-notes"
            v-model="returnModal.notes"
            class="return-modal__textarea"
            rows="3"
            placeholder="Optional details…"
          />

          <div class="return-modal__actions">
            <button
              type="button"
              class="return-modal__btn return-modal__btn--ghost"
              @click="returnModal.open = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="return-modal__btn return-modal__btn--primary"
              :disabled="returnModal.loading"
              @click="submitReturn"
            >
              {{ returnModal.loading ? 'Submitting…' : 'Submit Request' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.order-detail {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 1.5rem var(--container-pad) 4rem;
}

.order-detail__header {
  margin-bottom: 2rem;
}

.order-detail__body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (width >= 1024px) {
  .order-detail__body {
    flex-direction: row;
    align-items: flex-start;
  }
}

.order-detail__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-detail__sidebar {
  width: 100%;
}

@media (width >= 1024px) {
  .order-detail__sidebar {
    width: 22rem;
    flex-shrink: 0;
  }
}

.order-detail__card {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.order-detail__section-title {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 0.75rem;
}

.order-detail__address {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
  line-height: 1.6;
  font-style: normal;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.order-detail__addr-name {
  font-family: var(--font-label);
  font-weight: 700;
  color: var(--color-on-surface);
  font-size: 0.9375rem;
}

.order-detail__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 0;
}

.order-detail__skel-line {
  background: var(--color-surface-container-low);
  border-radius: var(--radius-sm);
  height: 1.25rem;
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

.order-detail__skel-line:nth-child(1) {
  width: 30%;
}

.order-detail__skel-line:nth-child(2) {
  width: 80%;
}

.order-detail__skel-line:nth-child(3) {
  width: 60%;
}

.order-detail__skel-line:nth-child(4) {
  width: 40%;
}

@keyframes skeleton-shimmer {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

.order-detail__back {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.75rem 2rem;
  border-radius: var(--radius-DEFAULT);
  text-decoration: none;
}

/* Return modal */
.return-modal-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--color-on-surface) 50%, transparent);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.return-modal {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.return-modal__title {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.return-modal__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.return-modal__select,
.return-modal__textarea {
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

.return-modal__select:focus,
.return-modal__textarea:focus {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.return-modal__textarea {
  resize: vertical;
  min-height: 5rem;
}

.return-modal__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.return-modal__btn {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-DEFAULT);
  border: none;
  cursor: pointer;
  transition:
    box-shadow var(--transition-base),
    opacity var(--transition-fast);
}

.return-modal__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.return-modal__btn--primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
}

.return-modal__btn--primary:hover:not(:disabled) {
  box-shadow: var(--shadow-btn-hover);
}

.return-modal__btn--ghost {
  background: none;
  color: var(--color-secondary);
  border: 1px solid color-mix(in srgb, var(--color-outline) 30%, transparent);
}

.return-modal__btn--ghost:hover {
  background: var(--color-surface-container-low);
}
</style>
