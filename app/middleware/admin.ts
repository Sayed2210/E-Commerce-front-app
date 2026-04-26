export default defineNuxtRouteMiddleware(async () => {
  const token = getAccessToken()
  const authStore = useAuthStore()

  if (!token) {
    return navigateTo('/admin/login')
  }

  // Ensure user data is loaded
  if (!authStore.user) {
    const { fetchUser } = useAuth()
    await fetchUser()
  }

  // Check if user has admin role
  if (!authStore.isAdmin) {
    return navigateTo('/')
  }
})
