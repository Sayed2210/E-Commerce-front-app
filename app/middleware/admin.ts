import { getAccessToken } from '~/utils/token'

/**
 * Middleware to protect admin routes
 */
export default defineNuxtRouteMiddleware(async () => {
  const token = getAccessToken()
  const authStore = useAuthStore()

  // Check if user is authenticated
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
