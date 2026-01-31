<template>
  <div>
    <!-- Hero Section -->
    <section
      class="bg-gradient-to-r from-primary-600 to-primary-800 py-20 text-white"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold">Welcome to E-Commerce</h1>
          <p class="mt-4 text-xl text-primary-100">
            Discover amazing products at unbeatable prices
          </p>
          <div class="mt-8 flex justify-center gap-4">
            <UButton to="/products" size="xl" color="white" variant="solid">
              Shop Now
            </UButton>
            <UButton to="/categories" size="xl" color="white" variant="outline">
              Browse Categories
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-3">
          <div class="text-center">
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
            >
              <UIcon
                name="i-heroicons-truck"
                class="h-6 w-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3
              class="mt-4 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Free Shipping
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              On orders over $50
            </p>
          </div>

          <div class="text-center">
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
            >
              <UIcon
                name="i-heroicons-shield-check"
                class="h-6 w-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3
              class="mt-4 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Secure Payment
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              100% secure transactions
            </p>
          </div>

          <div class="text-center">
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="h-6 w-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3
              class="mt-4 text-lg font-semibold text-gray-900 dark:text-white"
            >
              Easy Returns
            </h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              30-day return policy
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="bg-gray-50 py-16 dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Check out our latest and greatest items
          </p>
        </div>

        <div class="mt-12">
          <UCard>
            <div class="text-center py-12">
              <UIcon
                name="i-heroicons-cube"
                class="mx-auto h-12 w-12 text-gray-400"
              />
              <h3
                class="mt-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                No products yet
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Products will be displayed here once added
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Homepage - no authentication required
</script>
