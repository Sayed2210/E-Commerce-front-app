<script setup lang="ts">
import type { Coupon } from '~/types/api'

interface Props {
  coupons: Coupon[]
  processingId: string | null
}

interface Emits {
  (e: 'toggle', coupon: Coupon): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
defineEmits<Emits>()

function formatValue(c: Coupon) {
  return c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `$${c.value}` : 'Free shipping'
}

function formatDate(date: string | null | undefined) {
  return date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
}
</script>

<template>
  <div class="coupon-table__wrap">
    <table class="coupon-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Type</th>
          <th>Value</th>
          <th>Min Order</th>
          <th>Usage</th>
          <th>Expires</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in coupons" :key="c.id">
          <td class="coupon-table__code">{{ c.code }}</td>
          <td class="coupon-table__type">{{ c.type.replace(/_/g, ' ') }}</td>
          <td>{{ formatValue(c) }}</td>
          <td>${{ c.minOrderValue }}</td>
          <td class="coupon-table__usage">
            {{ c.usageCount }}{{ c.usageLimit ? ` / ${c.usageLimit}` : '' }}
          </td>
          <td class="coupon-table__date">{{ formatDate(c.endDate) }}</td>
          <td>
            <span class="coupon-table__badge" :class="c.isActive ? 'badge--active' : 'badge--inactive'">
              {{ c.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <div class="coupon-table__actions">
              <button
                type="button"
                class="coupon-table__btn coupon-table__btn--toggle"
                :disabled="processingId === c.id"
                @click="$emit('toggle', c)"
              >
                {{ c.isActive ? 'Deactivate' : 'Activate' }}
              </button>
              <button
                type="button"
                class="coupon-table__btn coupon-table__btn--delete"
                :disabled="processingId === c.id"
                @click="$emit('delete', c.id)"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.coupon-table__wrap {
  overflow-x: auto;
}

.coupon-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.coupon-table thead {
  background: var(--color-surface-container);
}

.coupon-table thead th {
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: var(--color-secondary);
}

.coupon-table tbody td {
  padding: 1rem;
  border-top: 1px solid var(--color-outline-variant);
}

.coupon-table__code {
  font-family: var(--font-label);
  font-weight: 700;
}

.coupon-table__type {
  text-transform: capitalize;
}

.coupon-table__usage {
  text-align: center;
}

.coupon-table__date {
  font-size: 0.8rem;
  color: var(--color-secondary);
}

.coupon-table__badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.coupon-table__badge.badge--active {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
}

.coupon-table__badge.badge--inactive {
  background: color-mix(in srgb, var(--color-error) 12%, transparent);
  color: var(--color-error);
}

.coupon-table__actions {
  display: flex;
  gap: 0.5rem;
}

.coupon-table__btn {
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

.coupon-table__btn--toggle {
  color: var(--color-primary);
}

.coupon-table__btn--delete {
  color: var(--color-error);
}

.coupon-table__btn:hover:not(:disabled) {
  background: var(--color-surface-container-low);
}

.coupon-table__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
