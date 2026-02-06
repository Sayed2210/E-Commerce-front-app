import { type LoginCredentials, type RegisterData, type AuthResponse, type User, UserRole } from '~/types/auth'
import { setTokens, clearTokens } from '~/utils/token'
import { showErrorToast, showSuccessToast } from '~/utils/errorHandler'

/**
 * Main authentication composable
 */
export function useAuth() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const authStore = useAuthStore()
  const router = useRouter()

  /**
   * Login user or admin
   */
  async function login(credentials: LoginCredentials, isAdmin = false) {
    authStore.setLoading(true)

    try {
      const data = await $fetch<AuthResponse>(`${baseURL}/auth/login`, {
        method: 'POST',
        body: credentials
      })

      if (!data) {
        showErrorToast({ message: 'Login failed. Please try again.' })
        return false
      }

      // Check if user has required role
      if (isAdmin && data.user.role !== UserRole.ADMIN) {
        showErrorToast({ message: 'Access denied. Admin privileges required.' })
        return false
      }

      console.log(data)

      // Store tokens and user data
      setTokens(data.tokens?.accessToken, data.tokens?.refreshToken)
      authStore.setUser(data.user)

      showSuccessToast('Login successful!')

      // Redirect based on role
      if (isAdmin) {
        await router.push('/admin')
      } else {
        await router.push('/')
      }

      return true
    } catch (err) {
      showErrorToast(err)
      return false
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Register new user
   */
  async function register(userData: RegisterData) {
    authStore.setLoading(true)

    try {
      const responseData = await $fetch<AuthResponse>(
        `${baseURL}/auth/register`,
        {
          method: 'POST',
          body: userData
        }
      )

      if (!responseData) {
        showErrorToast({ message: 'Registration failed. Please try again.' })
        return false
      }

      // Auto-login after registration
      setTokens(responseData.accessToken, responseData.refreshToken)
      authStore.setUser(responseData.user)

      showSuccessToast('Registration successful! Welcome!')
      await router.push('/')

      return true
    } catch (err) {
      showErrorToast(err)
      return false
    } finally {
      authStore.setLoading(false)
    }
  }

  /**
   * Logout user
   */
  async function logout() {
    try {
      // Call logout endpoint
      await $fetch(`${baseURL}/auth/logout`, {
        method: 'POST'
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear tokens and user data
      clearTokens()
      authStore.clearUser()

      // Redirect to login
      await router.push('/login')
    }
  }

  /**
   * Fetch current user data
   */
  async function fetchUser() {
    const { apiCall } = useApiClient()

    try {
      const { data, error } = await apiCall<User>('/users/me', {
        method: 'GET'
      })

      if (error.value || !data.value) {
        return null
      }

      authStore.setUser(data.value!)
      return data.value
    } catch (err) {
      console.error('Fetch user error:', err)
      return null
    }
  }

  return {
    login,
    register,
    logout,
    fetchUser,
    user: computed(() => authStore.currentUser),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    loading: computed(() => authStore.loading)
  }
}
