import type { UseFetchOptions } from 'nuxt/app'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './token'

/**
 * Create an authenticated API client with automatic token refresh
 */
export function useApiClient() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  /**
   * Make an authenticated API request
   */
  async function apiCall<T>(
    url: string,
    options: UseFetchOptions<T> = {}
  ) {
    const accessToken = getAccessToken()

    // Add authorization header if token exists
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const { data, error, status } = await useFetch<T>(`${baseURL}${url}`, {
      ...options,
      headers
    })

    // Handle 401 Unauthorized - token expired
    if (status.value === 'error' && error.value?.statusCode === 401) {
      const refreshToken = getRefreshToken()
      
      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const refreshed = await refreshAccessToken()
          
          if (refreshed) {
            // Retry the original request with new token
            const newAccessToken = getAccessToken()
            headers.Authorization = `Bearer ${newAccessToken}`
            
            return await useFetch<T>(`${baseURL}${url}`, {
              ...options,
              headers
            })
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          clearTokens()
          await navigateTo('/login')
        }
      } else {
        // No refresh token, redirect to login
        clearTokens()
        await navigateTo('/login')
      }
    }

    return { data, error, status }
  }

  /**
   * Refresh access token using refresh token
   */
  async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getRefreshToken()
    
    if (!refreshToken) {
      return false
    }

    try {
      const { data, error } = await useFetch<{ accessToken: string; refreshToken: string }>(
        `${baseURL}/auth/refresh`,
        {
          method: 'POST',
          body: { refreshToken }
        }
      )

      if (error.value || !data.value) {
        return false
      }

      setTokens(data.value.accessToken, data.value.refreshToken)
      return true
    } catch {
      return false
    }
  }

  return {
    apiCall,
    refreshAccessToken
  }
}
