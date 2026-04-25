<script setup lang="ts">
import type { StaffMember } from '~/types/api'

interface Props {
  member: StaffMember
  editing?: boolean
  processing?: boolean
  editForm?: {
    firstName: string
    lastName: string
    role: string
  }
}

withDefaults(defineProps<Props>(), {
  editing: false,
  processing: false,
})

const emit = defineEmits<{
  'start-edit': []
  update: []
  'cancel-edit': []
  delete: []
}>()
</script>

<template>
  <tr class="hover:bg-surface-container-low transition-colors">
    <template v-if="editing">
      <td class="table-td">
        <div class="grid grid-cols-2 gap-2">
          <input
            v-model="editForm!.firstName"
            type="text"
            class="form__input"
            placeholder="First"
          />
          <input v-model="editForm!.lastName" type="text" class="form__input" placeholder="Last" />
        </div>
      </td>
      <td class="table-td text-secondary">{{ member.email }}</td>
      <td class="table-td">
        <select v-model="editForm!.role" class="form__input">
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <AdminTableActions>
        <button type="button" class="table-action" :disabled="processing" @click="emit('update')">
          Save
        </button>
        <button type="button" class="table-action" @click="emit('cancel-edit')">Cancel</button>
      </AdminTableActions>
    </template>
    <template v-else>
      <td class="table-td font-semibold text-on-surface">
        {{ [member.firstName, member.lastName].filter(Boolean).join(' ') || '—' }}
      </td>
      <td class="table-td text-secondary">{{ member.email }}</td>
      <td class="table-td"><AdminSharedStatusBadge :status="member.role" size="sm" /></td>
      <AdminTableActions>
        <button type="button" class="table-action" @click="emit('start-edit')">Edit</button>
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
