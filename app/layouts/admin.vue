<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Admin Sidebar -->
    <aside
      class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="border-b border-gray-200 p-6 dark:border-gray-700">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 p-4">
          <NuxtLink
            to="/admin"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            active-class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
          >
            <UIcon name="i-heroicons-home" class="h-5 w-5" />
            <span>Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/products"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            active-class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
          >
            <UIcon name="i-heroicons-cube" class="h-5 w-5" />
            <span>Products</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            active-class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
          >
            <UIcon name="i-heroicons-shopping-bag" class="h-5 w-5" />
            <span>Orders</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/users"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            active-class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
          >
            <UIcon name="i-heroicons-users" class="h-5 w-5" />
            <span>Users</span>
          </NuxtLink>

          <NuxtLink
            to="/admin/categories"
            class="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            active-class="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
          >
            <UIcon name="i-heroicons-tag" class="h-5 w-5" />
            <span>Categories</span>
          </NuxtLink>
        </nav>

        <!-- User Menu -->
        <div class="border-t border-gray-200 p-4 dark:border-gray-700">
          <UDropdown :items="userMenuItems" :popper="{ placement: 'top' }">
            <button
              class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <UAvatar size="sm" :alt="user?.email" />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ user?.email }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </div>
              </div>
              <UIcon
                name="i-heroicons-chevron-up"
                class="h-5 w-5 text-gray-400"
              />
            </button>
          </UDropdown>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Header -->
      <header
        class="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex h-16 items-center justify-between px-6">
          <div>
            <!-- Page title can be injected via slot -->
          </div>

          <div class="flex items-center gap-4">
            <!-- Color Mode Toggle -->
            <UButton
              icon="i-heroicons-moon"
              color="gray"
              variant="ghost"
              @click="toggleColorMode"
            />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout, user } = useAuth();
const colorMode = useColorMode();

const userMenuItems = [
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-6-tooth",
      click: () => navigateTo("/admin/settings"),
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle",
      click: () => logout(),
    },
  ],
];

function toggleColorMode() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>
