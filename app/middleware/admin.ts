export default defineNuxtRouteMiddleware(async () => {
  const token = useCookie('access_token')
  const authStore = useAuthStore()

  if (!token.value) {
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
