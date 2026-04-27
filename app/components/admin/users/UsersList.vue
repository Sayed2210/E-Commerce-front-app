<script setup lang="ts">
import type { User } from '~/types/api'
import { useAdmin } from '~/composables/useAdmin'

const { listUsers, deleteUser } = useAdmin()

const currentPage = ref(1)
const limit = 10
const processingId = ref<string | null>(null)

const { data: usersData, pending, refresh } = listUsers({ page: currentPage, limit })

const users = computed<User[]>(() => usersData.value?.data ?? [])
const totalUsers = computed(() => usersData.value?.total ?? 0)
const totalPages = computed(() => usersData.value?.totalPages ?? 1)

async function handleDelete(id: string) {
  processingId.value = id
  const { error } = await deleteUser(id)
  if (!error) {
    await refresh()
  }
  processingId.value = null
}

function handlePageChange(page: number) {
  currentPage.value = page
}
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader title="Customers" description="View and manage registered customer accounts">
      <p class="text-xs text-secondary">{{ totalUsers }} total users</p>
    </AdminPageHeader>

    <AdminDataTable
      :pending="pending"
      :empty="!users.length"
      :column-count="5"
      :pagination="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      empty-text="No customers found"
      @update:current-page="handlePageChange"
    >
      <template #header>
        <thead class="bg-surface-container">
          <tr>
            <th class="table-th">Name</th>
            <th class="table-th">Email</th>
            <th class="table-th">Role</th>
            <th class="table-th">Joined</th>
            <th class="table-th">Actions</th>
          </tr>
        </thead>
      </template>

      <UsersTableRow
        v-for="user in users"
        :key="user.id"
        :user="user"
        :processing="processingId === user.id"
        @delete="handleDelete(user.id)"
      />
    </AdminDataTable>
  </div>
</template>

<style scoped>
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
