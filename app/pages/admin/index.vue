<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {{ user?.email }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-primary-100 p-3 dark:bg-primary-900">
              <UIcon
                name="i-heroicons-cube"
                class="h-6 w-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Products
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                1,234
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <UIcon
                name="i-heroicons-shopping-bag"
                class="h-6 w-6 text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                856
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <UIcon
                name="i-heroicons-users"
                class="h-6 w-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                3,421
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div class="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <UIcon
                name="i-heroicons-currency-dollar"
                class="h-6 w-6 text-yellow-600 dark:text-yellow-400"
              />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                $45,231
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Recent Orders -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <UButton to="/admin/orders" variant="ghost" color="primary">
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-center text-gray-600 dark:text-gray-400 py-8">
            No recent orders to display
          </p>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <div class="grid gap-6 md:grid-cols-3">
        <UButton
          to="/admin/products"
          color="primary"
          size="lg"
          icon="i-heroicons-plus"
          block
        >
          Add Product
        </UButton>

        <UButton
          to="/admin/categories"
          color="gray"
          size="lg"
          icon="i-heroicons-tag"
          block
        >
          Manage Categories
        </UButton>

        <UButton
          to="/admin/users"
          color="gray"
          size="lg"
          icon="i-heroicons-users"
          block
        >
          View Users
        </UButton>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const { user } = useAuth();
</script>
