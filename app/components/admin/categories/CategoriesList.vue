<script setup lang="ts">
import type { Category } from '~/types/api'
import { useCategoriesAdmin } from '~/composables/useCategoriesAdmin'

const { listCategories, createCategory, deleteCategory } = useCategoriesAdmin()

const { data: categoriesData, pending, refresh } = listCategories({ limit: 100 })
const categories = computed<Category[]>(() => categoriesData.value ?? [])

const showCreate = ref(false)
const processingId = ref<string | null>(null)

const form = reactive({
  name: '',
  slug: '',
  description: '',
  image: '',
  parentId: '',
})

function resetForm() {
  form.name = ''
  form.slug = ''
  form.description = ''
  form.image = ''
  form.parentId = ''
}

async function handleCreate() {
  const { error } = await createCategory({ ...form, parentId: form.parentId || undefined })
  if (!error) {
    resetForm()
    showCreate.value = false
    await refresh()
  }
}

async function handleDelete(id: string) {
  processingId.value = id
  const { error } = await deleteCategory(id)
  if (!error) await refresh()
  processingId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader title="Categories" description="Manage product catalog categories">
      <button type="button" class="admin-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined text-sm">{{ showCreate ? 'close' : 'add' }}</span>
        {{ showCreate ? 'Cancel' : 'New Category' }}
      </button>
    </AdminPageHeader>

    <AdminFormPanel v-if="showCreate">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <div class="grid grid-cols-2 gap-4">
          <div class="form__field">
            <label class="form__label">Name</label>
            <input v-model="form.name" required type="text" class="form__input" />
          </div>
          <div class="form__field">
            <label class="form__label">Slug</label>
            <input v-model="form.slug" type="text" class="form__input" />
          </div>
          <div class="form__field">
            <label class="form__label">Image URL</label>
            <input v-model="form.image" type="url" class="form__input" />
          </div>
          <div class="form__field">
            <label class="form__label">Parent Category</label>
            <select v-model="form.parentId" class="form__input">
              <option value="">None</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="form__field">
          <label class="form__label">Description</label>
          <textarea v-model="form.description" rows="3" class="form__input" />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="admin-btn">Create Category</button>
        </div>
      </form>
    </AdminFormPanel>

    <AdminDataTable :pending="pending" :empty="!categories.length" :column-count="4">
      <template #header>
        <thead class="bg-surface-container">
          <tr>
            <th class="table-th">Name</th>
            <th class="table-th">Slug</th>
            <th class="table-th">Parent</th>
            <th class="table-th">Actions</th>
          </tr>
        </thead>
      </template>

      <AdminCategoriesTableRow
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :all-categories="categories"
        :processing="processingId === category.id"
        @delete="handleDelete(category.id)"
        @update="refresh"
      />

      <template #empty>
        <tr>
          <td colspan="4" class="px-6 py-12 text-center text-secondary text-sm">
            No categories found
          </td>
        </tr>
      </template>
    </AdminDataTable>
  </div>
</template>

<style scoped>
.admin-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
  border: none;
  border-radius: var(--radius-DEFAULT);
  padding: 0.625rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
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
  width: 100%;
  background: var(--color-surface-container);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
}

.form__input:focus {
  border-color: var(--color-primary);
}

.table-th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
}
</style>
