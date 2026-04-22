export default defineNuxtPlugin(async () => {
  const token = useCookie('access_token')
  const authStore = useAuthStore()

  if (token.value && !authStore.user) {
    const { fetchUser } = useAuth()
    await fetchUser()
  }
})
