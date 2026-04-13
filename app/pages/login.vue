<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4"
  >
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
      </template>

      <UForm
        :schema="loginSchema"
        :state="formData"
        @submit="handleSubmit"
        class="space-y-4"
      >
        <!-- Email Field -->
        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            size="lg"
          />
        </UFormGroup>

        <!-- Password Field -->
        <UFormGroup label="Password" name="password" required>
          <UInput
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            icon="i-heroicons-lock-closed"
            size="lg"
          />
        </UFormGroup>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <UCheckbox v-model="rememberMe" label="Remember me" />
          <NuxtLink
            to="/forgot-password"
            class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Error Message -->
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          :title="errorMessage"
          icon="i-heroicons-exclamation-triangle"
        />

        <!-- Submit Button -->
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="loading"
        >
          Sign In
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
          >
            Sign up
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { loginSchema } from "~/utils/validation";

definePageMeta({
  layout: false,
  middleware: "guest",
});

const { login, loading } = useAuth();

const formData = ref({
  email: "",
  password: "",
});

const rememberMe = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  errorMessage.value = "";

  const success = await login(formData.value, false); // isAdmin = false

  if (!success) {
    errorMessage.value = "Invalid email or password";
  }
}
</script>
