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
  const mod = await import('~/middleware/guest')
  return mod.default({} as any, {} as any)
}

describe('guest middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('allows unauthenticated users through', async () => {
    const { getAccessToken } = await import('~/utils/token')
    vi.mocked(getAccessToken).mockReturnValue(null)

    await runMiddleware()

    expect(mockNavigateTo).not.toHaveBeenCalled()
  })

  it('redirects authenticated admins to /admin', async () => {
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

    expect(mockNavigateTo).toHaveBeenCalledWith('/admin')
  })

  it('redirects authenticated regular users to /', async () => {
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
})
