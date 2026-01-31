<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          My Account
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <!-- User Info -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h2>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Email</label
            >
            <p class="mt-1 text-gray-900 dark:text-white">{{ user?.email }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >First Name</label
            >
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ user?.firstName || "Not set" }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Last Name</label
            >
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ user?.lastName || "Not set" }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Member Since</label
            >
            <p class="mt-1 text-gray-900 dark:text-white">
              {{ new Date(user?.createdAt || "").toLocaleDateString() }}
            </p>
          </div>
        </div>

        <template #footer>
          <UButton color="primary"> Edit Profile </UButton>
        </template>
      </UCard>

      <!-- Quick Links -->
      <div class="grid gap-6 md:grid-cols-2">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shopping-bag" class="h-5 w-5" />
              <h3 class="font-semibold">My Orders</h3>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            View and track your orders
          </p>
          <template #footer>
            <UButton to="/orders" variant="ghost"> View Orders </UButton>
          </template>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-heart" class="h-5 w-5" />
              <h3 class="font-semibold">Wishlist</h3>
            </div>
          </template>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Manage your favorite items
          </p>
          <template #footer>
            <UButton to="/wishlist" variant="ghost"> View Wishlist </UButton>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { user } = useAuth();
</script>
