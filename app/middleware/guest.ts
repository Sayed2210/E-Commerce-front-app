export default defineNuxtRouteMiddleware(async () => {
  const token = useCookie('access_token')
  const authStore = useAuthStore()

  // If authenticated, redirect based on role
  if (token.value) {
    // Load user data if not already loaded
    if (!authStore.user) {
      const { fetchUser } = useAuth()
      await fetchUser()
    }

    // Redirect admins to dashboard, users to homepage
    if (authStore.isAdmin) {
      return navigateTo('/admin')
    } else {
      return navigateTo('/')
    }
  }
})
