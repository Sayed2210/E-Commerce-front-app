<script setup lang="ts">
import type { StaffMember } from '~/types/api'
import { useAdmin } from '~/composables/useAdmin'

const { listStaff, createStaff, updateStaff, deleteStaff } = useAdmin()

const { data: staffData, pending, refresh } = listStaff()
const staff = computed<StaffMember[]>(() => staffData.value ?? [])

const processingId = ref<string | null>(null)
const editingId = ref<string | null>(null)
const showCreate = ref(false)

const form = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'staff',
})

const editForm = reactive({
  firstName: '',
  lastName: '',
  role: 'staff',
})

function resetCreateForm() {
  form.email = ''
  form.password = ''
  form.firstName = ''
  form.lastName = ''
  form.role = 'staff'
}

function startEdit(member: StaffMember) {
  editingId.value = member.id
  editForm.firstName = member.firstName ?? ''
  editForm.lastName = member.lastName ?? ''
  editForm.role = member.role
}

async function handleCreate() {
  const { error } = await createStaff(form)
  if (!error) {
    resetCreateForm()
    showCreate.value = false
    await refresh()
  }
}

async function handleUpdate(id: string) {
  processingId.value = id
  const { error } = await updateStaff(id, editForm)
  if (!error) {
    editingId.value = null
    await refresh()
  }
  processingId.value = null
}

async function handleDelete(id: string) {
  processingId.value = id
  const { error } = await deleteStaff(id)
  if (!error) await refresh()
  processingId.value = null
}
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader title="Staff" description="Manage admin and staff accounts">
      <button type="button" class="admin-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined text-sm">{{ showCreate ? 'close' : 'add' }}</span>
        {{ showCreate ? 'Cancel' : 'New Staff' }}
      </button>
    </AdminPageHeader>

    <AdminFormPanel v-if="showCreate">
      <form class="space-y-4" @submit.prevent="handleCreate">
        <div class="grid grid-cols-2 gap-4">
          <div class="form__field">
            <label class="form__label">Email</label>
            <input v-model="form.email" required type="email" class="form__input" />
          </div>
          <div class="form__field">
            <label class="form__label">Password</label>
            <input v-model="form.password" required type="password" class="form__input" />
          </div>
          <div class="form__field">
            <label class="form__label">First Name</label>
            <input v-model="form.firstName" type="text" class="form__input" />
          </div>
          <div class="form__field">
            <label class="form__label">Last Name</label>
            <input v-model="form.lastName" type="text" class="form__input" />
          </div>
        </div>
        <div class="form__field">
          <label class="form__label">Role</label>
          <select v-model="form.role" required class="form__input">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="admin-btn">Create Staff</button>
        </div>
      </form>
    </AdminFormPanel>

    <AdminDataTable :pending="pending" :empty="!staff.length" column-count="4">
      <template #header>
        <thead class="bg-surface-container">
          <tr>
            <th class="table-th">Name</th>
            <th class="table-th">Email</th>
            <th class="table-th">Role</th>
            <th class="table-th">Actions</th>
          </tr>
        </thead>
      </template>

      <AdminStaffTableRow
        v-for="member in staff"
        :key="member.id"
        :member="member"
        :editing="editingId === member.id"
        :processing="processingId === member.id"
        :edit-form="editForm"
        @start-edit="startEdit(member)"
        @update="handleUpdate(member.id)"
        @cancel-edit="editingId = null"
        @delete="handleDelete(member.id)"
      />

      <template #empty>
        <tr>
          <td colspan="4" class="px-6 py-12 text-center text-secondary text-sm">No staff found</td>
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
