import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useAuth } from '~/composables/useAuth'
import { UserRole } from '~/types/auth'

vi.mock('~/utils/token', () => ({
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getAccessToken: vi.fn(() => 'mock-access-token'),
  getRefreshToken: vi.fn(() => 'mock-refresh-token'),
}))

vi.mock('~/utils/errorHandler', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}))

const { mockUseRouter } = vi.hoisted(() => ({ mockUseRouter: vi.fn() }))
mockNuxtImport('useRouter', () => mockUseRouter)
mockNuxtImport('useRuntimeConfig', () =>
  vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } }))
)

const mockPush = vi.fn()

const mockCustomer = {
  id: 'user-1',
  email: 'user@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.CUSTOMER,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockAdmin = {
  ...mockCustomer,
  id: 'admin-1',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
}

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('$fetch', vi.fn())
    mockUseRouter.mockReturnValue({ push: mockPush })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('calls POST /auth/login with credentials', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      await useAuth().login({ email: 'user@example.com', password: 'pass123' })

      expect($fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: { email: 'user@example.com', password: 'pass123' },
        })
      )
    })

    it('returns true and redirects to / on successful user login', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const result = await useAuth().login({ email: 'user@example.com', password: 'pass123' })

      expect(result).toBe(true)
      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('redirects to /admin on successful admin login', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockAdmin,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      await useAuth().login({ email: 'admin@example.com', password: 'pass123' }, true)

      expect(mockPush).toHaveBeenCalledWith('/admin')
    })

    it('denies admin login when user is not admin', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const result = await useAuth().login({ email: 'user@example.com', password: 'pass123' }, true)

      expect(result).toBe(false)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('returns false and shows error on API failure', async () => {
      vi.mocked($fetch).mockRejectedValueOnce(new Error('Invalid credentials'))
      const { showErrorToast } = await import('~/utils/errorHandler')

      const result = await useAuth().login({ email: 'x@example.com', password: 'wrong' })

      expect(result).toBe(false)
      expect(showErrorToast).toHaveBeenCalled()
    })

    it('sets user in auth store on successful login', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const auth = useAuth()
      await auth.login({ email: 'user@example.com', password: 'pass123' })

      expect(auth.user.value).toEqual(mockCustomer)
    })

    it('calls setTokens with access and refresh tokens', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'new-at', refreshToken: 'new-rt' },
      })
      const { setTokens } = await import('~/utils/token')

      await useAuth().login({ email: 'user@example.com', password: 'pass123' })

      expect(setTokens).toHaveBeenCalledWith('new-at', 'new-rt')
    })

    it('loading is false after login resolves', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const auth = useAuth()
      await auth.login({ email: 'user@example.com', password: 'pass123' })

      expect(auth.loading.value).toBe(false)
    })
  })

  describe('register', () => {
    it('calls POST /auth/register with data', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      await useAuth().register({ email: 'new@example.com', password: 'pass123', firstName: 'New' })

      expect($fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({ method: 'POST' })
      )
    })

    it('returns true and redirects to / on success', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const result = await useAuth().register({ email: 'new@example.com', password: 'pass123' })

      expect(result).toBe(true)
      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('returns false on API failure', async () => {
      vi.mocked($fetch).mockRejectedValueOnce(new Error('Email taken'))

      const result = await useAuth().register({ email: 'taken@example.com', password: 'pass123' })

      expect(result).toBe(false)
    })

    it('sets user in auth store on success', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const auth = useAuth()
      await auth.register({ email: 'new@example.com', password: 'pass123' })

      expect(auth.user.value).toEqual(mockCustomer)
    })
  })

  describe('logout', () => {
    it('calls POST /auth/logout', async () => {
      vi.mocked($fetch).mockResolvedValueOnce(undefined)

      await useAuth().logout()

      expect($fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({ method: 'POST' })
      )
    })

    it('clears tokens on logout', async () => {
      vi.mocked($fetch).mockResolvedValueOnce(undefined)
      const { clearTokens } = await import('~/utils/token')

      await useAuth().logout()

      expect(clearTokens).toHaveBeenCalled()
    })

    it('clears user from store on logout', async () => {
      vi.mocked($fetch).mockResolvedValueOnce(undefined)
      const auth = useAuth()
      const { useAuthStore } = await import('~/stores/auth')
      useAuthStore().setUser(mockCustomer)

      await auth.logout()

      expect(auth.user.value).toBeNull()
    })

    it('redirects to /login on logout', async () => {
      vi.mocked($fetch).mockResolvedValueOnce(undefined)

      await useAuth().logout()

      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('clears tokens even if logout API call fails', async () => {
      vi.mocked($fetch).mockRejectedValueOnce(new Error('Network error'))
      const { clearTokens } = await import('~/utils/token')

      await useAuth().logout()

      expect(clearTokens).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('resendVerification', () => {
    it('calls POST /auth/resend-verification', async () => {
      vi.mocked($fetch).mockResolvedValueOnce(undefined)

      await useAuth().resendVerification()

      expect($fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/resend-verification'),
        expect.objectContaining({ method: 'POST' })
      )
    })

    it('returns true on success', async () => {
      vi.mocked($fetch).mockResolvedValueOnce(undefined)

      const result = await useAuth().resendVerification()

      expect(result).toBe(true)
    })

    it('returns false on failure', async () => {
      vi.mocked($fetch).mockRejectedValueOnce(new Error('Not found'))

      const result = await useAuth().resendVerification()

      expect(result).toBe(false)
    })
  })

  describe('computed properties', () => {
    it('isAuthenticated is false with no user', () => {
      const auth = useAuth()
      expect(auth.isAuthenticated.value).toBe(false)
    })

    it('isAuthenticated is true after login', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const auth = useAuth()
      await auth.login({ email: 'user@example.com', password: 'pass123' })

      expect(auth.isAuthenticated.value).toBe(true)
    })

    it('isAdmin is false for regular user', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockCustomer,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const auth = useAuth()
      await auth.login({ email: 'user@example.com', password: 'pass123' })

      expect(auth.isAdmin.value).toBe(false)
    })

    it('isAdmin is true for admin user', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({
        user: mockAdmin,
        tokens: { accessToken: 'at', refreshToken: 'rt' },
      })

      const auth = useAuth()
      await auth.login({ email: 'admin@example.com', password: 'pass123' })

      expect(auth.isAdmin.value).toBe(true)
    })
  })
})
