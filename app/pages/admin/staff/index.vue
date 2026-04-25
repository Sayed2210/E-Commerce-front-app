<script setup lang="ts">
import type { StaffMember } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'admin' })

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

useSeoMeta({ title: 'Staff — Admin' })
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-bold font-headline text-on-surface">Staff</h2>
        <p class="text-secondary text-sm">Manage admin and staff accounts</p>
      </div>
      <button type="button" class="admin-btn" @click="showCreate = !showCreate">
        <span class="material-symbols-outlined text-sm">{{ showCreate ? 'close' : 'add' }}</span>
        {{ showCreate ? 'Cancel' : 'New Staff' }}
      </button>
    </div>

    <form v-if="showCreate" class="panel grid gap-4 md:grid-cols-2" @submit.prevent="handleCreate">
      <div>
        <label class="field-label">Email</label>
        <input v-model="form.email" required type="email" class="field-input" />
      </div>
      <div>
        <label class="field-label">Password</label>
        <input v-model="form.password" required type="password" class="field-input" />
      </div>
      <div>
        <label class="field-label">First Name</label>
        <input v-model="form.firstName" type="text" class="field-input" />
      </div>
      <div>
        <label class="field-label">Last Name</label>
        <input v-model="form.lastName" type="text" class="field-input" />
      </div>
      <div>
        <label class="field-label">Role</label>
        <select v-model="form.role" required class="field-input">
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div class="flex items-end justify-end">
        <button type="submit" class="admin-btn">Create Staff</button>
      </div>
    </form>

    <div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-container">
          <tr>
            <th class="table-th">Name</th>
            <th class="table-th">Email</th>
            <th class="table-th">Role</th>
            <th class="table-th">Actions</th>
          </tr>
        </thead>
        <AdminSharedDataTableSkeleton v-if="pending" :rows="6" :columns="4" />
        <tbody v-else class="divide-y divide-outline-variant/10">
          <tr
            v-for="member in staff"
            :key="member.id"
            class="hover:bg-surface-container-low transition-colors"
          >
            <template v-if="editingId === member.id">
              <td class="table-td">
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="editForm.firstName"
                    type="text"
                    class="field-input"
                    placeholder="First"
                  />
                  <input
                    v-model="editForm.lastName"
                    type="text"
                    class="field-input"
                    placeholder="Last"
                  />
                </div>
              </td>
              <td class="table-td text-secondary">{{ member.email }}</td>
              <td class="table-td">
                <select v-model="editForm.role" class="field-input">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="table-td">
                <button
                  type="button"
                  class="table-action"
                  :disabled="processingId === member.id"
                  @click="handleUpdate(member.id)"
                >
                  Save
                </button>
                <button type="button" class="table-action" @click="editingId = null">Cancel</button>
              </td>
            </template>
            <template v-else>
              <td class="table-td font-semibold text-on-surface">
                {{ [member.firstName, member.lastName].filter(Boolean).join(' ') || '—' }}
              </td>
              <td class="table-td text-secondary">{{ member.email }}</td>
              <td class="table-td"><AdminSharedStatusBadge :status="member.role" size="sm" /></td>
              <td class="table-td">
                <button type="button" class="table-action" @click="startEdit(member)">Edit</button>
                <button
                  type="button"
                  class="table-action table-action--danger"
                  :disabled="processingId === member.id"
                  @click="handleDelete(member.id)"
                >
                  Delete
                </button>
              </td>
            </template>
          </tr>
          <tr v-if="!staff.length">
            <td colspan="4" class="px-6 py-12 text-center text-secondary text-sm">
              No staff found
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
