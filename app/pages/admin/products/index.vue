<template>
  <NuxtLayout name="admin">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Manage your product catalog
          </p>
        </div>
        <UButton color="primary" size="lg" icon="i-heroicons-plus">
          Add Product
        </UButton>
      </div>

      <!-- Products Table -->
      <UCard>
        <div class="text-center py-12">
          <UIcon
            name="i-heroicons-cube"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No products
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new product.
          </p>
          <div class="mt-6">
            <UButton color="primary" icon="i-heroicons-plus">
              New Product
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});
</script>
