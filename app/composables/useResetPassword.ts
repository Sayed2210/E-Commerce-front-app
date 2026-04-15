import { resetPasswordSchema } from '~/utils/validation'

export function useResetPassword() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const route = useRoute()
  const router = useRouter()

  const token = computed(() => String(route.query.token ?? ''))
  const invalidToken = computed(() => !token.value)

  const form = ref({ newPassword: '', confirmPassword: '' })
  const errors = ref<Record<string, string>>({})
  const loading = ref(false)
  const success = ref(false)
  const serverError = ref('')

  async function handleSubmit() {
    serverError.value = ''
    errors.value = {}

    const result = resetPasswordSchema.safeParse(form.value)
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.value[String(issue.path[0])] = issue.message
      }
      return
    }

    loading.value = true
    try {
      await $fetch(`${baseURL}/auth/reset-password`, {
        method: 'POST',
        body: { token: token.value, newPassword: form.value.newPassword },
      })
      success.value = true
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      serverError.value = e?.data?.message ?? 'This reset link is invalid or has expired.'
    } finally {
      loading.value = false
    }
  }

  return { form, errors, loading, success, serverError, invalidToken, handleSubmit }
}
