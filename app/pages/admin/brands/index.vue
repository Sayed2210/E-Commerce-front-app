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
  <section class="brands-list">
    <div class="brands-list__head">
      <h1 class="brands-list__title">Brands</h1>
      <button type="button" class="brands-list__create-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined" aria-hidden="true">{{
          showCreate ? 'close' : 'add'
        }}</span>
        {{ showCreate ? 'Cancel' : 'New Brand' }}
      </button>
    </div>

    <div v-if="showCreate" class="brands-list__form">
      <form class="form" @submit.prevent="handleCreate">
        <div class="form__row">
          <div class="form__field">
            <label class="form__label">Brand Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form__input"
              placeholder="e.g. Apple"
              required
            />
          </div>
          <div class="form__field">
            <label class="form__label">Slug (optional)</label>
            <input v-model="form.slug" type="text" class="form__input" placeholder="e.g. apple" />
          </div>
        </div>
        <div class="form__row">
          <div class="form__field">
            <label class="form__label">Logo URL (optional)</label>
            <input v-model="form.logo" type="url" class="form__input" placeholder="https://..." />
          </div>
        </div>
        <div class="form__actions">
          <button type="submit" class="form__submit">Create Brand</button>
        </div>
      </form>
    </div>

    <div v-if="pending" class="brands-list__loading">
      <div v-for="i in 4" :key="i" class="brands-list__skel" />
    </div>

    <AppEmptyState
      v-else-if="!brands.length"
      icon="business"
      title="No brands yet"
      body="Create your first brand above."
    />

    <div v-else class="brands-list__table">
      <table class="table">
        <thead class="table__head">
          <tr>
            <th class="table__th">Name</th>
            <th class="table__th">Slug</th>
            <th class="table__th">Logo</th>
            <th class="table__th">Actions</th>
          </tr>
        </thead>
        <tbody class="table__body">
          <tr v-for="brand in brands" :key="brand.id" class="table__tr">
            <td class="table__td">{{ brand.name }}</td>
            <td class="table__td">{{ brand.slug }}</td>
            <td class="table__td">
              <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" class="table__logo" />
              <span v-else class="table__empty">—</span>
            </td>
            <td class="table__td">
              <button
                type="button"
                class="table__delete"
                :disabled="processingId === brand.id"
                @click="handleDelete(brand.id)"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.brands-list__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.brands-list__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.brands-list__create-btn {
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

.brands-list__create-btn:hover {
  box-shadow: var(--shadow-btn-hover);
}

.brands-list__form {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

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

.form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
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

.brands-list__loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.brands-list__skel {
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

.table {
  width: 100%;
  border-collapse: collapse;
}

.table__head {
  background: var(--color-surface-container);
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

.table__tr {
  border-bottom: 1px solid var(--color-outline-variant);
}

.table__td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.table__logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.table__empty {
  color: var(--color-outline);
}

.table__delete {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--color-error);
  opacity: 0.7;
  transition: opacity var(--transition-base);
}

.table__delete:hover {
  opacity: 1;
}

.table__delete:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
