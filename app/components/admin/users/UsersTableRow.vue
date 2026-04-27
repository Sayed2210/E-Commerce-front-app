<script setup lang="ts">
import type { User } from '~/types/api'

interface Props {
  user: User
  processing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  processing: false,
})

const emit = defineEmits<{
  delete: []
}>()

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const fullName = computed(() => {
  return [props.user.firstName, props.user.lastName].filter(Boolean).join(' ') || '—'
})

const roleLabel = computed(() => {
  return props.user.roles.map((role) => role.toLowerCase()).join(', ')
})
</script>

<template>
  <tr class="hover:bg-surface-container-low transition-colors">
    <td class="table-td font-semibold text-on-surface">{{ fullName }}</td>
    <td class="table-td text-secondary">{{ user.email }}</td>
    <td class="table-td">
      <AdminSharedStatusBadge :status="roleLabel" size="sm" />
    </td>
    <td class="table-td text-secondary">{{ formatDate(user.createdAt) }}</td>
    <AdminTableActions>
      <button
        type="button"
        class="table-action table-action--danger"
        :disabled="processing"
        @click="emit('delete')"
      >
        Delete
      </button>
    </AdminTableActions>
  </tr>
</template>

<style scoped>
.table-td {
  padding: 1rem;
  font-size: 0.875rem;
}

.table-action {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
}

.table-action--danger {
  color: var(--color-error);
}
</style>
