<script setup lang="ts">
import type { Brand } from '~/types/api'

interface Props {
  brand: Brand
  processing?: boolean
}

withDefaults(defineProps<Props>(), {
  processing: false,
})

const emit = defineEmits<{
  delete: []
}>()
</script>

<template>
  <tr class="border-t border-outline-variant/10">
    <td class="table__td">{{ brand.name }}</td>
    <td class="table__td">{{ brand.slug }}</td>
    <td class="table__td">
      <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" class="table__logo" />
      <span v-else class="table__empty">—</span>
    </td>
    <AdminTableActions>
      <button
        type="button"
        class="table__delete"
        :disabled="processing"
        :aria-busy="processing"
        @click="emit('delete')"
      >
        <span class="material-symbols-outlined">delete</span>
      </button>
    </AdminTableActions>
  </tr>
</template>

<style scoped>
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
