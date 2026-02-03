import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './token'

/**
 * Create an authenticated API client with automatic token refresh
 */
export function useApiClient() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  /**
   * Private $fetch instance with interceptors
   */
  const client = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const accessToken = getAccessToken()
      if (accessToken) {
        // Use Headers helper to ensure compatibility
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${accessToken}`)
        options.headers = headers
      }
    },
    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        const refreshToken = getRefreshToken()
        if (refreshToken) {
          try {
            const refreshed = await refreshAccessToken()
            if (refreshed) {
              // Retry the original request
              // @ts-expect-error - options mismatch between Resolved and Nitro types
              return $fetch(request, options)
            }
          } catch (error) {
            console.error('Refresh token failed:', error)
            clearTokens()
            await navigateTo('/login')
          }
        } else {
          clearTokens()
          await navigateTo('/login')
        }
      }
    }
  })

  /**
   * Make an authenticated API request
   */
  async function apiCall<T>(
    url: string,
    options: Parameters<typeof client>[1] = {}
  ) {
    const { data, error, status } = await useAsyncData<T>(
      url,
      () => client<T>(url, options)
    )

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
      // Use raw $fetch for refresh to avoid infinite loops
      const data = await $fetch<{ accessToken: string; refreshToken: string }>(
        `${baseURL}/auth/refresh`,
        {
          method: 'POST',
          body: { refreshToken }
        }
      )

      if (!data) {
        return false
      }

      setTokens(data.accessToken, data.refreshToken)
      return true
    } catch {
      return false
    }
  }

  return {
    apiCall,
    refreshAccessToken,
    client
  }
}
