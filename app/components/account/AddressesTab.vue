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

    <AddressForm
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

<style scoped lang="scss" src="./AddressesTab.scss"></style>
