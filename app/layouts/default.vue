<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation Header -->
    <header
      class="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <NuxtLink
            to="/"
            class="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            E-Commerce
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="hidden items-center gap-6 md:flex">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/products"
              class="text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
            >
              Products
            </NuxtLink>
            <NuxtLink
              to="/categories"
              class="text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
            >
              Categories
            </NuxtLink>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <!-- Shopping Cart -->
            <NuxtLink to="/cart" class="relative">
              <UButton
                icon="i-heroicons-shopping-cart"
                color="gray"
                variant="ghost"
              />
              <span
                v-if="cartItemsCount > 0"
                class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white"
              >
                {{ cartItemsCount }}
              </span>
            </NuxtLink>

            <!-- User Menu or Login -->
            <template v-if="isAuthenticated">
              <UDropdown :items="userMenuItems">
                <UButton
                  icon="i-heroicons-user-circle"
                  color="gray"
                  variant="ghost"
                  :label="user?.email"
                  trailing-icon="i-heroicons-chevron-down"
                />
              </UDropdown>
            </template>
            <template v-else>
              <UButton to="/login" color="primary" variant="soft">
                Login
              </UButton>
              <UButton to="/register" color="primary"> Sign Up </UButton>
            </template>

            <!-- Color Mode Toggle -->
            <UButton
              icon="i-heroicons-moon"
              color="gray"
              variant="ghost"
              @click="toggleColorMode"
            />
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              E-Commerce
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your trusted online shopping destination.
            </p>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Shop</h4>
            <ul class="mt-2 space-y-2">
              <li>
                <NuxtLink
                  to="/products"
                  class="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                >
                  All Products
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/categories"
                  class="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                >
                  Categories
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Account</h4>
            <ul class="mt-2 space-y-2">
              <li>
                <NuxtLink
                  to="/account"
                  class="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                >
                  My Account
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/orders"
                  class="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                >
                  Orders
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Support</h4>
            <ul class="mt-2 space-y-2">
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            © {{ new Date().getFullYear() }} E-Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth();
const colorMode = useColorMode();

// Mock cart count (replace with actual cart store)
const cartItemsCount = ref(0);

const userMenuItems = [
  [
    {
      label: "My Account",
      icon: "i-heroicons-user",
      click: () => navigateTo("/account"),
    },
    {
      label: "Orders",
      icon: "i-heroicons-shopping-bag",
      click: () => navigateTo("/orders"),
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
