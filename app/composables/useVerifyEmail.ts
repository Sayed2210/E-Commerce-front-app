type VerifyState = 'loading' | 'success' | 'error' | 'no-token'

export function useVerifyEmail() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const route = useRoute()

  const token = computed(() => String(route.query.token ?? ''))
  const state = ref<VerifyState>(token.value ? 'loading' : 'no-token')
  const errorMessage = ref('This verification link is invalid or has already been used.')

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
      errorMessage.value =
        e?.data?.message ?? 'This verification link is invalid or has already been used.'
      state.value = 'error'
    }
  })

  return { state, errorMessage }
}
