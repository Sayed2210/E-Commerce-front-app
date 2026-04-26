<script setup lang="ts">
import type { Address, CreateAddressDto } from '~/types/api'

defineProps<{ modelValue: string | null; addresses: Address[] }>()
const emit = defineEmits<{
  'update:modelValue': [id: string]
  add: [dto: CreateAddressDto]
}>()

const showForm = ref(false)
const { createAddress } = useAddresses()

function addressLabel(a: Address) {
  const parts = [a.streetAddress, a.city, a.state, a.postalCode, a.country].filter(Boolean)
  return parts.join(', ')
}

async function handleAdd(dto: CreateAddressDto) {
  const { data } = await createAddress(dto)
  if (data) {
    emit('add', dto)
    showForm.value = false
  }
}
</script>

<template>
  <section class="addr-picker">
    <h2 class="addr-picker__title">Shipping Address</h2>

    <div v-if="addresses.length" class="addr-picker__list">
      <label
        v-for="addr in addresses"
        :key="addr.id"
        class="addr-picker__card"
        :class="{ 'addr-picker__card--selected': modelValue === addr.id }"
      >
        <input
          type="radio"
          name="shipping-address"
          class="addr-picker__radio"
          :value="addr.id"
          :checked="modelValue === addr.id"
          @change="emit('update:modelValue', addr.id)"
        />
        <span class="addr-picker__card-body">
          <span v-if="addr.firstName || addr.lastName" class="addr-picker__name">
            {{ [addr.firstName, addr.lastName].filter(Boolean).join(' ') }}
          </span>
          <span class="addr-picker__line">{{ addressLabel(addr) }}</span>
          <span v-if="addr.isDefault" class="addr-picker__default">Default</span>
        </span>
      </label>
    </div>

    <AppEmptyState
      v-else-if="!showForm"
      icon="location_on"
      title="No saved addresses"
      body="Add your first shipping address below."
    />

    <AddressForm
      v-if="showForm"
      class="addr-picker__form"
      @submit="handleAdd"
      @cancel="showForm = false"
    />

    <button v-if="!showForm" type="button" class="addr-picker__add" @click="showForm = true">
      <span class="material-symbols-outlined" aria-hidden="true">add</span>
      Add New Address
    </button>
  </section>
</template>

<style scoped>
.addr-picker__title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 1.25rem;
}

.addr-picker__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.addr-picker__card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition:
    background var(--transition-fast),
    box-shadow var(--transition-base);
}

.addr-picker__card--selected {
  background: var(--color-primary-fixed);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.addr-picker__radio {
  accent-color: var(--color-primary);
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.addr-picker__card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.addr-picker__name {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.addr-picker__line {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.addr-picker__default {
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
}

.addr-picker__form {
  background: var(--color-surface-container-low);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.addr-picker__add {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  padding: 0;
  transition: opacity var(--transition-fast);
}

.addr-picker__add:hover {
  opacity: 0.75;
}

.addr-picker__add .material-symbols-outlined {
  font-size: 1rem;
}
</style>
