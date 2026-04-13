<script setup lang="ts">
import { loginSchema } from '~/utils/validation'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const { login, loading } = useAuth()

const formData = ref({
  email: '',
  password: '',
})

const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  const success = await login(formData.value, true) // isAdmin = true

  if (!success) {
    errorMessage.value = 'Invalid credentials or insufficient permissions'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the admin dashboard
          </p>
        </div>
      </template>

      <UForm :schema="loginSchema" :state="formData" class="space-y-4" @submit="handleSubmit">
        <!-- Email Field -->
        <UInput
          v-model="formData.email"
          type="email"
          placeholder="admin@example.com"
          icon="i-heroicons-envelope"
          size="lg"
          required
          class="w-full"
          autofocus
        />

        <!-- Password Field -->
        <UInput
          v-model="formData.password"
          type="password"
          placeholder="Enter your password"
          icon="i-heroicons-lock-closed"
          size="lg"
          required
          class="w-full"
        />

        <!-- Error Message -->
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          :title="errorMessage"
          icon="i-heroicons-exclamation-triangle"
        />

        <!-- Submit Button -->
        <UButton type="submit" color="primary" size="lg" block :loading="loading">
          Sign In
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          <NuxtLink
            to="/login"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            User login instead
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
