<script setup lang="ts">
import type { Category } from '~/types/api'
import { useCategoriesAdmin } from '~/composables/useCategoriesAdmin'

interface Props {
  category: Category
  allCategories: Category[]
}

const { category, allCategories } = defineProps<Props>()

const emit = defineEmits<{
  delete: []
  update: []
}>()

const { updateCategory } = useCategoriesAdmin()

const editingId = ref<string | null>(null)
const processing = ref(false)

const editForm = reactive({
  name: '',
  slug: '',
  description: '',
  image: '',
  parentId: '',
})

const parentCategory = computed(() => {
  return allCategories.find((item) => item.id === category.parentId)?.name ?? '—'
})

function startEdit() {
  editingId.value = category.id
  editForm.name = category.name
  editForm.slug = category.slug
  editForm.description = category.description ?? ''
  editForm.image = category.image ?? ''
  editForm.parentId = category.parentId ?? ''
}

async function handleSave() {
  processing.value = true
  const { error } = await updateCategory(category.id, {
    ...editForm,
    parentId: editForm.parentId || undefined,
  })
  if (!error) {
    editingId.value = null
    emit('update')
  }
  processing.value = false
}

function cancelEdit() {
  editingId.value = null
}
</script>

<template>
  <tr class="hover:bg-surface-container-low transition-colors">
    <template v-if="editingId === category.id">
      <td class="table-td">
        <input v-model="editForm.name" required type="text" class="form__input" />
      </td>
      <td class="table-td">
        <input v-model="editForm.slug" type="text" class="form__input" />
      </td>
      <td class="table-td">
        <select v-model="editForm.parentId" class="form__input">
          <option value="">None</option>
          <option
            v-for="option in allCategories.filter((item) => item.id !== category.id)"
            :key="option.id"
            :value="option.id"
          >
            {{ option.name }}
          </option>
        </select>
      </td>
      <AdminTableActions>
        <button type="button" class="table-action" :disabled="processing" @click="handleSave">
          Save
        </button>
        <button type="button" class="table-action" @click="cancelEdit">Cancel</button>
      </AdminTableActions>
    </template>
    <template v-else>
      <td class="table-td font-semibold text-on-surface">{{ category.name }}</td>
      <td class="table-td text-secondary">{{ category.slug }}</td>
      <td class="table-td text-secondary">{{ parentCategory }}</td>
      <AdminTableActions>
        <button type="button" class="table-action" @click="startEdit">Edit</button>
        <button
          type="button"
          class="table-action table-action--danger"
          :disabled="processing"
          @click="emit('delete')"
        >
          Delete
        </button>
      </AdminTableActions>
    </template>
  </tr>
</template>

<style scoped>
.table-td {
  padding: 1rem;
  font-size: 0.875rem;
}

.form__input {
  width: 100%;
  background: var(--color-surface-container);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
}

.form__input:focus {
  border-color: var(--color-primary);
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
