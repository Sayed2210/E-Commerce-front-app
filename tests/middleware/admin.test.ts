import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

vi.mock('~/utils/token', () => ({
  getAccessToken: vi.fn(),
}))

vi.mock('~/composables/useAuth', () => ({
  useAuth: vi.fn(() => ({
    fetchUser: vi.fn(),
  })),
}))

const { mockNavigateTo } = vi.hoisted(() => ({ mockNavigateTo: vi.fn() }))
mockNuxtImport('navigateTo', () => mockNavigateTo)

async function getStore() {
  const { useAuthStore } = await import('~/stores/auth')
  return useAuthStore()
}

async function runMiddleware() {
  const mod = await import('~/middleware/admin')
  return mod.default({} as any, {} as any)
}

describe('admin middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('redirects unauthenticated users to /admin/login', async () => {
    const { getAccessToken } = await import('~/utils/token')
    vi.mocked(getAccessToken).mockReturnValue(null)

    await runMiddleware()

    expect(mockNavigateTo).toHaveBeenCalledWith('/admin/login')
  })

  it('redirects non-admin users to /', async () => {
    const { getAccessToken } = await import('~/utils/token')
    vi.mocked(getAccessToken).mockReturnValue('user-token')

    const store = await getStore()
    store.setUser({
      id: 'user-1',
      email: 'user@example.com',
      role: 'customer' as any,
      createdAt: '',
      updatedAt: '',
    })

    await runMiddleware()

    expect(mockNavigateTo).toHaveBeenCalledWith('/')
  })

  it('allows admin users through', async () => {
    const { getAccessToken } = await import('~/utils/token')
    vi.mocked(getAccessToken).mockReturnValue('admin-token')

    const store = await getStore()
    store.setUser({
      id: 'admin-1',
      email: 'admin@example.com',
      role: 'admin' as any,
      createdAt: '',
      updatedAt: '',
    })

    await runMiddleware()

    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
