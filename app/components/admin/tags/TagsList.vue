<script setup lang="ts">
import type { Tag } from '~/types/api'
import { useTags } from '~/composables/useTags'

const { listTags, createTag, deleteTag } = useTags()

const { data: tagsData, pending, refresh } = listTags()
const tags = computed<Tag[]>(() => tagsData.value ?? [])

const showCreate = ref(false)
const processingId = ref<string | null>(null)

const form = reactive({
  name: '',
  slug: '',
})

async function handleCreate() {
  const { error } = await createTag(form)
  if (!error) {
    showCreate.value = false
    form.name = ''
    form.slug = ''
    await refresh()
  }
}

async function handleDelete(id: string) {
  processingId.value = id
  const { error } = await deleteTag(id)
  if (!error) {
    await refresh()
  }
  processingId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader title="Tags">
      <button type="button" class="admin-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined text-sm">{{ showCreate ? 'close' : 'add' }}</span>
        {{ showCreate ? 'Cancel' : 'New Tag' }}
      </button>
    </AdminPageHeader>

    <AdminFormPanel v-if="showCreate">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <div class="grid grid-cols-2 gap-4">
          <div class="form__field">
            <label class="form__label">Tag Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form__input"
              placeholder="e.g. New Arrival"
              required
            />
          </div>
          <div class="form__field">
            <label class="form__label">Slug (optional)</label>
            <input
              v-model="form.slug"
              type="text"
              class="form__input"
              placeholder="e.g. new-arrival"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="admin-btn">Create Tag</button>
        </div>
      </form>
    </AdminFormPanel>

    <AdminDataTable :pending="pending" :empty="!tags.length" :column-count="3">
      <template #header>
        <thead class="bg-surface-container">
          <tr>
            <th class="table-th">Name</th>
            <th class="table-th">Slug</th>
            <th class="table-th">Actions</th>
          </tr>
        </thead>
      </template>

      <tr v-for="tag in tags" :key="tag.id" class="border-t border-outline-variant/10">
        <td class="table-td">{{ tag.name }}</td>
        <td class="table-td">{{ tag.slug }}</td>
        <AdminTableActions>
          <button
            type="button"
            class="table-delete"
            :disabled="processingId === tag.id"
            @click="handleDelete(tag.id)"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </AdminTableActions>
      </tr>

      <template #empty>
        <AppEmptyState icon="sell" title="No tags yet" body="Create your first tag above." />
      </template>
    </AdminDataTable>
  </div>
</template>

<style scoped>
.admin-btn {
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

.table-td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
}

.table-delete {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--color-error);
  opacity: 0.7;
  transition: opacity var(--transition-base);
}

.table-delete:hover {
  opacity: 1;
}

.table-delete:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
