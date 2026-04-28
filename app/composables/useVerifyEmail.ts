type VerifyState = 'loading' | 'success' | 'error' | 'no-token' | 'pending'

export function useVerifyEmail() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const route = useRoute()
  const { t } = useI18n()

  const token = computed(() => String(route.query.token ?? ''))
  const sent = computed(() => route.query.sent === 'true')
  const initialState: VerifyState = token.value ? 'loading' : sent.value ? 'pending' : 'no-token'
  const state = ref<VerifyState>(initialState)
  const errorMessage = ref(t('auth.invalidVerificationLink'))

  onMounted(async () => {
    if (!token.value) return

    try {
      await $fetch(`${baseURL}/auth/verify-email`, {
        method: 'POST',
        body: { token: token.value },
      })
      state.value = 'success'
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      errorMessage.value = e?.data?.message ?? t('auth.invalidVerificationLink')
      state.value = 'error'
    }
  })

  return { state, errorMessage, sent }
}
