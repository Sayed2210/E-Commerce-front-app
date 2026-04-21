import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

vi.mock('~/utils/token', () => ({
  getAccessToken: vi.fn(),
}))

const { mockNavigateTo } = vi.hoisted(() => ({ mockNavigateTo: vi.fn() }))
mockNuxtImport('navigateTo', () => mockNavigateTo)

async function runMiddleware(to: object) {
  const mod = await import('~/middleware/auth')
  return mod.default(to as any, {} as any)
}

describe('auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('redirects to /login when no token exists', async () => {
    const { getAccessToken } = await import('~/utils/token')
    vi.mocked(getAccessToken).mockReturnValue(null)

    await runMiddleware({ fullPath: '/profile' })

    expect(mockNavigateTo).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/profile' },
    })
  })

  it('preserves the intended destination in the redirect query', async () => {
    const { getAccessToken } = await import('~/utils/token')
    vi.mocked(getAccessToken).mockReturnValue(null)

    await runMiddleware({ fullPath: '/checkout' })

    expect(mockNavigateTo).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/checkout' },
    })
  })

  it('allows the request through when token exists', async () => {
    const { getAccessToken } = await import('~/utils/token')
    vi.mocked(getAccessToken).mockReturnValue('valid-token')

    await runMiddleware({ fullPath: '/profile' })

    expect(mockNavigateTo).not.toHaveBeenCalled()
  })
})
