export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('access_token')

  if (!token.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  const authStore = useAuthStore()
  if (!authStore.user) {
    const { fetchUser } = useAuth()
    await fetchUser()
  }
})
