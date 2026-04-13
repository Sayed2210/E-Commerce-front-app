import type { LoginCredentials, RegisterData, AuthResponse, User } from '~/types/auth'
import { UserRole } from '~/types/auth'
import { setTokens, clearTokens } from '~/utils/token'
import { showErrorToast, showSuccessToast } from '~/utils/errorHandler'

export function useAuth() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const authStore = useAuthStore()
  const router = useRouter()

  async function login(credentials: LoginCredentials, isAdmin = false) {
    authStore.setLoading(true)
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/auth/login`, {
        method: 'POST',
        body: credentials
      })

      if (isAdmin && !response.user.roles.includes(UserRole.ADMIN)) {
        showErrorToast({ message: 'Access denied. Admin privileges required.' })
        return false
      }

      setTokens(response.accessToken, response.refreshToken)
      authStore.setUser(response.user)
      showSuccessToast('Login successful!')

      await router.push(isAdmin ? '/admin' : '/')
      return true
    } catch (err) {
      showErrorToast(err)
      return false
    } finally {
      authStore.setLoading(false)
    }
  }

  async function register(data: RegisterData) {
    authStore.setLoading(true)
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/auth/register`, {
        method: 'POST',
        body: data
      })

      setTokens(response.accessToken, response.refreshToken)
      authStore.setUser(response.user)
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

  async function logout() {
    try {
      await $fetch(`${baseURL}/auth/logout`, { method: 'POST' })
    } catch {
      // ignore
    } finally {
      clearTokens()
      authStore.clearUser()
      await router.push('/login')
    }
  }

  async function fetchUser(): Promise<User | null> {
    const { apiCall } = useApiClient()
    try {
      const { data, error } = await apiCall<User>('/users/me', { method: 'GET' })
      if (error || !data) return null
      authStore.setUser(data)
      return data
    } catch {
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
