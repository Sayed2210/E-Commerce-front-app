import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useVerifyEmail } from '~/composables/useVerifyEmail'

const { mockUseRoute } = vi.hoisted(() => ({ mockUseRoute: vi.fn() }))
const { mockOnMounted } = vi.hoisted(() => ({ mockOnMounted: vi.fn((cb: () => void) => cb()) }))
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))
mockNuxtImport('useRoute', () => mockUseRoute)
mockNuxtImport('onMounted', () => mockOnMounted)

describe('useVerifyEmail', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseRoute.mockReturnValue({ query: { token: 'valid-verify-token' } })
    mockOnMounted.mockImplementation((cb: () => void) => cb())
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('starts in loading state when token is present', () => {
    vi.mocked($fetch).mockReturnValue(new Promise(() => {}))
    const { state } = useVerifyEmail()
    expect(state.value).toBe('loading')
  })

  it('starts in no-token state when token is missing', () => {
    mockUseRoute.mockReturnValueOnce({ query: {} })
    const { state } = useVerifyEmail()
    expect(state.value).toBe('no-token')
  })

  it('sets state to success on successful verification', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { state } = useVerifyEmail()
    await Promise.resolve()
    expect(state.value).toBe('success')
  })

  it('calls POST /auth/verify-email with token', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    useVerifyEmail()
    await Promise.resolve()
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/verify-email'), expect.objectContaining({ method: 'POST', body: { token: 'valid-verify-token' } }))
  })

  it('sets state to error on API failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce({ data: { message: 'Expired' } })
    const { state } = useVerifyEmail()
    await Promise.resolve()
    expect(state.value).toBe('error')
  })

  it('uses custom error message from API response', async () => {
    vi.mocked($fetch).mockRejectedValueOnce({ data: { message: 'Link already used' } })
    const { errorMessage } = useVerifyEmail()
    await Promise.resolve()
    expect(errorMessage.value).toBe('Link already used')
  })

  it('uses default error message when API provides none', async () => {
    vi.mocked($fetch).mockRejectedValueOnce({})
    const { errorMessage } = useVerifyEmail()
    await Promise.resolve()
    expect(errorMessage.value).toBeTruthy()
  })
})
