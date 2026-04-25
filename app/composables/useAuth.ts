import type { LoginCredentials, RegisterData, AuthResponse, User } from '~/types/auth'
import { UserRole } from '~/types/auth'
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from '~/utils/token'
import { parseApiError, showErrorToast, showSuccessToast } from '~/utils/errorHandler'

export function useAuth() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const authStore = useAuthStore()
  const router = useRouter()

  async function login(
    credentials: LoginCredentials,
    isAdmin = false
  ): Promise<{ ok: boolean; error?: string }> {
    authStore.setLoading(true)
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/auth/login`, {
        method: 'POST',
        body: credentials,
      })

      if (isAdmin && response.user.role !== UserRole.ADMIN) {
        showErrorToast({ message: 'Access denied. Admin privileges required.' })
        return { ok: false, error: 'Access denied. Admin privileges required.' }
      }

      setTokens(response.tokens.accessToken, response.tokens.refreshToken)
      authStore.setUser(response.user)
      showSuccessToast('Login successful!')

      await router.push(isAdmin ? '/admin' : '/')
      return { ok: true }
    } catch (err) {
      const message = parseApiError(err)
      showErrorToast(err)
      return { ok: false, error: message }
    } finally {
      authStore.setLoading(false)
    }
  }

  async function register(data: RegisterData): Promise<{ ok: boolean; error?: string }> {
    authStore.setLoading(true)
    try {
      const response = await $fetch<AuthResponse>(`${baseURL}/auth/register`, {
        method: 'POST',
        body: data,
      })

      setTokens(response.tokens.accessToken, response.tokens.refreshToken)
      authStore.setUser(response.user)
      showSuccessToast('Registration successful! Please verify your email.')
      await router.push('/verify-email?sent=true')
      return { ok: true }
    } catch (err) {
      const message = parseApiError(err)
      showErrorToast(err)
      return { ok: false, error: message }
    } finally {
      authStore.setLoading(false)
    }
  }

  async function logout() {
    try {
      const refreshToken = getRefreshToken()
      await $fetch(`${baseURL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
        body: { refreshToken },
      })
    } catch {
      // ignore
    } finally {
      clearTokens()
      authStore.clearUser()
      await router.push('/login')
    }
  }

  async function resendVerification() {
    try {
      await $fetch(`${baseURL}/auth/resend-verification`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      })
      return true
    } catch {
      return false
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
    resendVerification,
    user: computed(() => authStore.currentUser),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    loading: computed(() => authStore.loading),
  }
}
