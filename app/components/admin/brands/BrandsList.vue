<script setup lang="ts">
import type { Brand } from '~/types/api'
import { useBrands } from '~/composables/useBrands'

const { listBrands, createBrand, deleteBrand } = useBrands()

const { data: brandsData, pending, refresh } = listBrands()
const brands = computed<Brand[]>(() => brandsData.value ?? [])

const showCreate = ref(false)
const processingId = ref<string | null>(null)

const form = reactive({
  name: '',
  slug: '',
  logo: '',
})

async function handleCreate() {
  const { error } = await createBrand(form)
  if (!error) {
    showCreate.value = false
    form.name = ''
    form.slug = ''
    form.logo = ''
    await refresh()
  }
}

async function handleDelete(id: string) {
  processingId.value = id
  const { error } = await deleteBrand(id)
  if (!error) {
    await refresh()
  }
  processingId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader :title="$t('admin.brandsPage.title')">
      <button
        type="button"
        class="bg-primary-container text-on-primary-container px-4 py-2 text-xs font-bold rounded flex items-center gap-2 hover:brightness-95 transition-all"
        @click="showCreate = !showCreate"
      >
        <span class="material-symbols-outlined text-sm">{{ showCreate ? 'close' : 'add' }}</span>
        {{ showCreate ? $t('admin.brandsPage.cancel') : $t('admin.brandsPage.newBrand') }}
      </button>
    </AdminPageHeader>

    <AdminFormPanel v-if="showCreate">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <div class="grid grid-cols-2 gap-4">
          <div class="form__field">
            <label class="form__label">{{ $t('admin.brandsPage.brandName') }}</label>
            <input
              v-model="form.name"
              type="text"
              class="form__input"
              placeholder="e.g. Apple"
              required
            />
          </div>
          <div class="form__field">
            <label class="form__label">{{ $t('admin.brandsPage.slugOptional') }}</label>
            <input v-model="form.slug" type="text" class="form__input" placeholder="e.g. apple" />
          </div>
        </div>
        <div class="form__field">
          <label class="form__label">{{ $t('admin.brandsPage.logoUrlOptional') }}</label>
          <input v-model="form.logo" type="url" class="form__input" placeholder="https://..." />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="form__submit">
            {{ $t('admin.brandsPage.createBrand') }}
          </button>
        </div>
      </form>
    </AdminFormPanel>

    <AdminDataTable :pending="pending" :empty="!brands.length" :column-count="4">
      <template #header>
        <thead class="bg-surface-container">
          <tr>
            <th class="table__th">{{ $t('admin.brandsPage.name') }}</th>
            <th class="table__th">{{ $t('admin.brandsPage.slug') }}</th>
            <th class="table__th">{{ $t('admin.brandsPage.logo') }}</th>
            <th class="table__th">{{ $t('admin.brandsPage.actions') }}</th>
          </tr>
        </thead>
      </template>

      <BrandsTableRow
        v-for="brand in brands"
        :key="brand.id"
        :brand="brand"
        :processing="processingId === brand.id"
        @delete="handleDelete(brand.id)"
      />

      <template #empty>
        <AppEmptyState
          icon="business"
          :title="$t('admin.brandsPage.noBrands')"
          :body="$t('admin.brandsPage.noBrandsBody')"
        />
      </template>
    </AdminDataTable>
  </div>
</template>

<style scoped>
.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form__label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
}

.form__input {
  background: var(--color-surface-container);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  transition: border-color var(--transition-base);
}

.form__input:focus {
  border-color: var(--color-primary);
}

.form__submit {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
}

.table__th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
}
</style>
