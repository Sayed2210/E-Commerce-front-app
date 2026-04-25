<script setup lang="ts">
import type { Category } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listCategories, createCategory, updateCategory, deleteCategory } = useCategoriesAdmin()

const { data: categoriesData, pending, refresh } = listCategories({ limit: 100 })
const categories = computed<Category[]>(() => categoriesData.value ?? [])

const showCreate = ref(false)
const editingId = ref<string | null>(null)
const processingId = ref<string | null>(null)

const form = reactive({ name: '', slug: '', description: '', image: '', parentId: '' })
const editForm = reactive({ name: '', slug: '', description: '', image: '', parentId: '' })

function resetForm() {
  form.name = ''
  form.slug = ''
  form.description = ''
  form.image = ''
  form.parentId = ''
}

function startEdit(category: Category) {
  editingId.value = category.id
  editForm.name = category.name
  editForm.slug = category.slug
  editForm.description = category.description ?? ''
  editForm.image = category.image ?? ''
  editForm.parentId = category.parentId ?? ''
}

async function handleCreate() {
  const { error } = await createCategory({ ...form, parentId: form.parentId || undefined })
  if (!error) {
    resetForm()
    showCreate.value = false
    await refresh()
  }
}

async function handleUpdate(id: string) {
  processingId.value = id
  const { error } = await updateCategory(id, {
    ...editForm,
    parentId: editForm.parentId || undefined,
  })
  if (!error) {
    editingId.value = null
    await refresh()
  }
  processingId.value = null
}

async function handleDelete(id: string) {
  processingId.value = id
  const { error } = await deleteCategory(id)
  if (!error) await refresh()
  processingId.value = null
}

useSeoMeta({ title: 'Categories — Admin' })
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-bold font-headline text-on-surface">Categories</h2>
        <p class="text-secondary text-sm">Manage product catalog categories</p>
      </div>
      <button type="button" class="admin-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined text-sm">{{ showCreate ? 'close' : 'add' }}</span>
        {{ showCreate ? 'Cancel' : 'New Category' }}
      </button>
    </div>

    <form v-if="showCreate" class="panel grid gap-4 md:grid-cols-2" @submit.prevent="handleCreate">
      <div>
        <label class="field-label">Name</label>
        <input v-model="form.name" required type="text" class="field-input" />
      </div>
      <div>
        <label class="field-label">Slug</label>
        <input v-model="form.slug" type="text" class="field-input" />
      </div>
      <div>
        <label class="field-label">Image URL</label>
        <input v-model="form.image" type="url" class="field-input" />
      </div>
      <div>
        <label class="field-label">Parent Category</label>
        <select v-model="form.parentId" class="field-input">
          <option value="">None</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="field-label">Description</label>
        <textarea v-model="form.description" rows="3" class="field-input" />
      </div>
      <div class="md:col-span-2 flex justify-end">
        <button type="submit" class="admin-btn">Create Category</button>
      </div>
    </form>

    <div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container">
          <tr>
            <th class="table-th">Name</th>
            <th class="table-th">Slug</th>
            <th class="table-th">Parent</th>
            <th class="table-th">Actions</th>
          </tr>
        </thead>
        <AdminSharedDataTableSkeleton v-if="pending" :rows="6" :columns="4" />
        <tbody v-else class="divide-y divide-outline-variant/10">
          <tr
            v-for="category in categories"
            :key="category.id"
            class="hover:bg-surface-container-low transition-colors"
          >
            <template v-if="editingId === category.id">
              <td class="table-td">
                <input v-model="editForm.name" required type="text" class="field-input" />
              </td>
              <td class="table-td">
                <input v-model="editForm.slug" type="text" class="field-input" />
              </td>
              <td class="table-td">
                <select v-model="editForm.parentId" class="field-input">
                  <option value="">None</option>
                  <option
                    v-for="option in categories.filter((item) => item.id !== category.id)"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </td>
              <td class="table-td">
                <button
                  type="button"
                  class="table-action"
                  :disabled="processingId === category.id"
                  @click="handleUpdate(category.id)"
                >
                  Save
                </button>
                <button type="button" class="table-action" @click="editingId = null">Cancel</button>
              </td>
            </template>
            <template v-else>
              <td class="table-td font-semibold text-on-surface">{{ category.name }}</td>
              <td class="table-td text-secondary">{{ category.slug }}</td>
              <td class="table-td text-secondary">
                {{ categories.find((item) => item.id === category.parentId)?.name ?? '—' }}
              </td>
              <td class="table-td">
                <button type="button" class="table-action" @click="startEdit(category)">
                  Edit
                </button>
                <button
                  type="button"
                  class="table-action table-action--danger"
                  :disabled="processingId === category.id"
                  @click="handleDelete(category.id)"
                >
                  Delete
                </button>
              </td>
            </template>
          </tr>
          <tr v-if="!categories.length">
            <td colspan="4" class="px-6 py-12 text-center text-secondary text-sm">
              No categories found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

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

.field-label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
}

.field-input {
  width: 100%;
  background: var(--color-surface-container);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
}

.field-input:focus {
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

.table-td {
  padding: 1rem;
  font-size: 0.875rem;
}

.table-action {
  margin-right: 0.75rem;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
}

.table-action--danger {
  color: var(--color-error);
}
</style>
