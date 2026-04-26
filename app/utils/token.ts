const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// SECURITY NOTE: tokens are written via document.cookie (client-side only).
// HttpOnly cannot be set from JavaScript — only a server Set-Cookie response header can do that.
// Until the backend issues tokens via a server-side endpoint with Set-Cookie: ...; HttpOnly; Secure; SameSite=Strict,
// any XSS on this origin can read both the access token and refresh token from document.cookie.
function setCookie(name: string, value: string, maxAge: number) {
  const cookie = useCookie<string | null>(name, {
    path: '/',
    maxAge,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  cookie.value = value
}

/**
 * Helper to get a cookie value
 */
function getCookie(name: string): string | null {
  const cookie = useCookie<string | null>(name)
  return cookie.value ?? null
}

/**
 * Helper to delete a cookie
 */
function deleteCookie(name: string) {
  const cookie = useCookie<string | null>(name, {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  cookie.value = null
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
