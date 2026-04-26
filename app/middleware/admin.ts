export default defineNuxtRouteMiddleware(async () => {
  const token = getAccessToken()
  const authStore = useAuthStore()

  if (!token) {
    return navigateTo('/admin/login')
  }

  // Ensure user data is loaded
  if (!authStore.user) {
    const { fetchUser } = useAuth()
    const user = await fetchUser()
    if (!user) {
      return navigateTo('/admin/login')
    }
  }

  // Check if user has admin role
  if (!authStore.isAdmin) {
    return navigateTo('/')
  }
})
