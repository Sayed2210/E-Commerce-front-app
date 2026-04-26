export default defineNuxtRouteMiddleware(async (to) => {
  const token = getAccessToken()

  if (!token) {
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
