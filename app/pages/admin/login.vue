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

  const { ok, error } = await login(formData.value, true) // isAdmin = true

  if (!ok && error) {
    errorMessage.value = error
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('admin.loginPage.title') }}
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ $t('admin.loginPage.subtitle') }}
          </p>
        </div>
      </template>

      <UForm :schema="loginSchema" :state="formData" class="space-y-4" @submit="handleSubmit">
        <!-- Email Field -->
        <UInput
          v-model="formData.email"
          type="email"
          :placeholder="$t('admin.loginPage.emailPlaceholder')"
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
          :placeholder="$t('admin.loginPage.passwordPlaceholder')"
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
          {{ $t('admin.loginPage.signIn') }}
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          <NuxtLink
            to="/login"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            {{ $t('admin.loginPage.userLogin') }}
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>
