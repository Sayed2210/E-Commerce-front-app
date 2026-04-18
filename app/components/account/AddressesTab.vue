<script setup lang="ts">
import { useAddresses } from '~/composables/useAddresses'
import type { Address, CreateAddressDto } from '~/types/api'
import { showSuccessToast, showErrorToast } from '~/utils/errorHandler'

const { getAddresses, createAddress, setDefault, deleteAddress } = useAddresses()

const { data, refresh } = await getAddresses()
const addresses = computed<Address[]>(() => data.value ?? [])

const showForm = ref(false)
const savingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

function addressLine(a: Address) {
  return [a.street, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(', ')
}

async function handleAdd(dto: CreateAddressDto) {
  const { error } = await createAddress(dto)
  if (error) {
    showErrorToast(error)
    return
  }
  showSuccessToast('Address added.')
  showForm.value = false
  await refresh()
}

async function handleSetDefault(id: string) {
  savingId.value = id
  const { error } = await setDefault(id)
  savingId.value = null
  if (error) {
    showErrorToast(error)
    return
  }
  showSuccessToast('Default address updated.')
  await refresh()
}

async function handleDelete(id: string) {
  deletingId.value = id
  const { error } = await deleteAddress(id)
  deletingId.value = null
  if (error) {
    showErrorToast(error)
    return
  }
  showSuccessToast('Address removed.')
  await refresh()
}
</script>

<template>
  <section class="addr-tab">
    <div class="addr-tab__head">
      <h2 class="addr-tab__title">Shipping Addresses</h2>
      <button v-if="!showForm" type="button" class="addr-tab__add-btn" @click="showForm = true">
        <span class="material-symbols-outlined" aria-hidden="true">add</span>
        Add Address
      </button>
    </div>

    <CheckoutAddressForm
      v-if="showForm"
      class="addr-tab__form"
      @submit="handleAdd"
      @cancel="showForm = false"
    />

    <ul v-if="addresses.length" class="addr-tab__list" role="list">
      <li v-for="addr in addresses" :key="addr.id" class="addr-tab__card">
        <div class="addr-tab__card-body">
          <p v-if="addr.firstName || addr.lastName" class="addr-tab__name">
            {{ [addr.firstName, addr.lastName].filter(Boolean).join(' ') }}
          </p>
          <p class="addr-tab__line">{{ addressLine(addr) }}</p>
          <span v-if="addr.isDefault" class="addr-tab__badge">Default</span>
        </div>
        <div class="addr-tab__actions">
          <button
            v-if="!addr.isDefault"
            type="button"
            class="addr-tab__action addr-tab__action--default"
            :disabled="savingId === addr.id"
            @click="handleSetDefault(addr.id)"
          >
            {{ savingId === addr.id ? '…' : 'Set Default' }}
          </button>
          <button
            type="button"
            class="addr-tab__action addr-tab__action--delete"
            :disabled="deletingId === addr.id"
            @click="handleDelete(addr.id)"
          >
            {{ deletingId === addr.id ? '…' : 'Remove' }}
          </button>
        </div>
      </li>
    </ul>

    <AppEmptyState
      v-else-if="!showForm"
      icon="location_on"
      title="No saved addresses"
      body="Add a shipping address to speed up checkout."
    />
  </section>
</template>

<style scoped lang="scss">
.addr-tab {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-family: var(--font-headline);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-on-surface);
    margin: 0;
  }

  &__add-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-primary-container) 100%
    );
    color: var(--color-on-primary);
    border: none;
    border-radius: var(--radius-DEFAULT);
    padding: 0.5rem 1.25rem;
    font-family: var(--font-label);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
    transition: box-shadow var(--transition-base);

    &:hover {
      box-shadow: var(--shadow-btn-hover);
    }

    .material-symbols-outlined {
      font-size: 1rem;
    }
  }

  &__form {
    background: var(--color-surface-container-low);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  &__card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    background: var(--color-surface-container-lowest);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    flex-wrap: wrap;
  }

  &__card-body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    font-family: var(--font-label);
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-on-surface);
    margin: 0;
  }

  &__line {
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--color-secondary);
    margin: 0;
  }

  &__badge {
    display: inline-flex;
    align-self: flex-start;
    padding: 2px 8px;
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    color: var(--color-primary);
    border-radius: var(--radius-full);
    font-family: var(--font-label);
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.25rem;
  }

  &__actions {
    display: flex;
    gap: 0.875rem;
    align-items: center;
    flex-shrink: 0;
  }

  &__action {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-label);
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    padding: 0;
    transition: opacity var(--transition-fast);

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--default {
      color: var(--color-primary);
    }

    &--delete {
      color: var(--color-error);
    }

    &:hover:not(:disabled) {
      opacity: 0.75;
    }
  }
}
</style>
