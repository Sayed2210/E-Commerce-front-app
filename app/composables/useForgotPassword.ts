import { forgotPasswordSchema } from '~/utils/validation'

export function useForgotPassword() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  const form = ref({ email: '' })
  const errors = ref<Record<string, string>>({})
  const loading = ref(false)
  const submitted = ref(false)
  const serverError = ref('')

  async function handleSubmit() {
    serverError.value = ''
    errors.value = {}

    const result = forgotPasswordSchema.safeParse(form.value)
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.value[String(issue.path[0])] = issue.message
      }
      return
    }

    loading.value = true
    try {
      await $fetch(`${baseURL}/auth/forgot-password`, {
        method: 'POST',
        body: { email: form.value.email },
      })
      submitted.value = true
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      serverError.value = e?.data?.message ?? 'Something went wrong. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return { form, errors, loading, submitted, serverError, handleSubmit }
}
