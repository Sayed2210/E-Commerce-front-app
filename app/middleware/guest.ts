export default defineNuxtRouteMiddleware(async () => {
  const token = getAccessToken()
  const authStore = useAuthStore()

  // If authenticated, redirect based on role
  if (token) {
    // Load user data if not already loaded
    if (!authStore.user) {
      const { fetchUser } = useAuth()
      const user = await fetchUser()
      if (!user) {
        return
      }
    }

    // Redirect admins to dashboard, users to homepage
    if (authStore.isAdmin) {
      return navigateTo('/admin')
    } else {
      return navigateTo('/')
    }
  }
})
