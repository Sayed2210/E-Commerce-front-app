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
              // Refresh succeeded — update header with new token before retry.
              // onRequest already ran with the expired token, so we must overwrite it here.
              const freshToken = getAccessToken()
              const headers = new Headers(options.headers)
              headers.set('Authorization', `Bearer ${freshToken}`)
              options.headers = headers
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
    },
  })

  async function apiCall<T>(
    url: string,
    options: Parameters<typeof $fetch>[1] & { method?: string } = {}
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const data = await client<T>(url, options)
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err }
    }
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
      const data = await $fetch<{ accessToken: string; refreshToken: string }>(
        `${baseURL}/auth/refresh`,
        { method: 'POST', body: { refreshToken } }
      )

      if (!data) return false

      setTokens(data.accessToken, data.refreshToken)
      return true
    } catch {
      return false
    }
  }

  return {
    apiCall,
    refreshAccessToken,
    client,
  }
}
