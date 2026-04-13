const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Helper to set a cookie with options
 */
function setCookie(name: string, value: string, maxAge: number) {
  if (import.meta.client) {
    const secure = process.env.NODE_ENV === 'production' ? ';Secure' : ''
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax${secure}`
  }
}

/**
 * Helper to get a cookie value
 */
function getCookie(name: string): string | null {
  if (import.meta.client) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match && match[2] ? decodeURIComponent(match[2]) : null
  }
  return null
}

/**
 * Helper to delete a cookie
 */
function deleteCookie(name: string) {
  if (import.meta.client) {
    document.cookie = `${name}=;path=/;max-age=0`
  }
}

/**
 * Store authentication tokens in cookies
 */
export function setTokens(accessToken: string, refreshToken: string) {
  setCookie(ACCESS_TOKEN_KEY, accessToken, 60 * 60 * 24) // 1 day
  setCookie(REFRESH_TOKEN_KEY, refreshToken, 60 * 60 * 24 * 7) // 7 days
}

/**
 * Get access token from cookie
 */
export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY)
}

/**
 * Get refresh token from cookie
 */
export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY)
}

/**
 * Clear all authentication tokens
 */
export function clearTokens() {
  deleteCookie(ACCESS_TOKEN_KEY)
  deleteCookie(REFRESH_TOKEN_KEY)
}
