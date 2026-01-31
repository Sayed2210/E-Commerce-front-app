import { useCookie } from '#app'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Store authentication tokens in HTTP-only cookies
 */
export function setTokens(accessToken: string, refreshToken: string) {
  const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY, {
    maxAge: 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
  
  const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })

  accessTokenCookie.value = accessToken
  refreshTokenCookie.value = refreshToken
}

/**
 * Get access token from cookie
 */
export function getAccessToken(): string | null {
  const cookie = useCookie(ACCESS_TOKEN_KEY)
  return cookie.value || null
}

/**
 * Get refresh token from cookie
 */
export function getRefreshToken(): string | null {
  const cookie = useCookie(REFRESH_TOKEN_KEY)
  return cookie.value || null
}

/**
 * Clear all authentication tokens
 */
export function clearTokens() {
  const accessTokenCookie = useCookie(ACCESS_TOKEN_KEY)
  const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY)
  
  accessTokenCookie.value = null
  refreshTokenCookie.value = null
}
