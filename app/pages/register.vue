<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4"
  >
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us today and start shopping
          </p>
        </div>
      </template>

      <UForm
        :schema="registerSchema"
        :state="formData"
        @submit="handleSubmit"
        class="space-y-4"
      >
        <!-- First Name Field -->
        <UFormGroup label="First Name" name="firstName">
          <UInput
            v-model="formData.firstName"
            type="text"
            placeholder="John"
            icon="i-heroicons-user"
            size="lg"
          />
        </UFormGroup>

        <!-- Last Name Field -->
        <UFormGroup label="Last Name" name="lastName">
          <UInput
            v-model="formData.lastName"
            type="text"
            placeholder="Doe"
            icon="i-heroicons-user"
            size="lg"
          />
        </UFormGroup>

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
            placeholder="Minimum 6 characters"
            icon="i-heroicons-lock-closed"
            size="lg"
          />
        </UFormGroup>

        <!-- Password Confirmation Field -->
        <UFormGroup
          label="Confirm Password"
          name="passwordConfirmation"
          required
        >
          <UInput
            v-model="formData.passwordConfirmation"
            type="password"
            placeholder="Re-enter your password"
            icon="i-heroicons-lock-closed"
            size="lg"
          />
        </UFormGroup>

        <!-- Terms & Conditions -->
        <UCheckbox v-model="acceptTerms" required>
          <template #label>
            <span class="text-sm">
              I agree to the
              <a href="#" class="text-primary-600 hover:text-primary-500"
                >Terms & Conditions</a
              >
            </span>
          </template>
        </UCheckbox>

        <!-- Error Message -->
        <UAlert
          v-if="errorMessage"
          color="red"
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
          :disabled="!acceptTerms"
        >
          Create Account
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
          >
            Sign in
          </NuxtLink>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { registerSchema } from "~/utils/validation";

definePageMeta({
  layout: false,
  middleware: "guest",
});

const { register, loading } = useAuth();

const formData = ref({
  email: "",
  password: "",
  passwordConfirmation: "",
  firstName: "",
  lastName: "",
});

const acceptTerms = ref(false);
const errorMessage = ref("");

async function handleSubmit() {
  if (!acceptTerms.value) {
    errorMessage.value = "You must accept the terms and conditions";
    return;
  }

  errorMessage.value = "";

  const success = await register(formData.value);

  if (!success) {
    errorMessage.value = "Registration failed. Please try again.";
  }
}
</script>
