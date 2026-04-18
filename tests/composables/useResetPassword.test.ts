import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useResetPassword } from '~/composables/useResetPassword'

const { mockUseRoute } = vi.hoisted(() => ({ mockUseRoute: vi.fn() }))
const { mockUseRouter } = vi.hoisted(() => ({ mockUseRouter: vi.fn() }))
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))
mockNuxtImport('useRoute', () => mockUseRoute)
mockNuxtImport('useRouter', () => mockUseRouter)

describe('useResetPassword', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseRoute.mockReturnValue({ query: { token: 'valid-reset-token' } })
    mockUseRouter.mockReturnValue({ push: vi.fn() })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('initializes with empty form', () => {
    const { form } = useResetPassword()
    expect(form.value.newPassword).toBe('')
    expect(form.value.confirmPassword).toBe('')
  })

  it.skip('token is internal — not exported from composable', () => {
    const { token } = useResetPassword()
    expect(token.value).toBe('valid-reset-token')
  })

  it('invalidToken is false when token is present', () => {
    const { invalidToken } = useResetPassword()
    expect(invalidToken.value).toBe(false)
  })

  it('invalidToken is true when token is missing', () => {
    mockUseRoute.mockReturnValueOnce({ query: {} })
    const { invalidToken } = useResetPassword()
    expect(invalidToken.value).toBe(true)
  })

  it('validates that passwords are not empty', async () => {
    const { form, errors, handleSubmit } = useResetPassword()
    form.value.newPassword = ''
    form.value.confirmPassword = ''
    await handleSubmit()
    expect(Object.keys(errors.value).length).toBeGreaterThan(0)
    expect($fetch).not.toHaveBeenCalled()
  })

  it('calls POST /auth/reset-password on valid input', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { form, handleSubmit } = useResetPassword()
    form.value.newPassword = 'StrongPass1!'
    form.value.confirmPassword = 'StrongPass1!'
    await handleSubmit()
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/reset-password'),
      expect.objectContaining({ method: 'POST', body: expect.objectContaining({ token: 'valid-reset-token', newPassword: 'StrongPass1!' }) })
    )
  })

  it('sets success to true on API success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { form, success, handleSubmit } = useResetPassword()
    form.value.newPassword = 'StrongPass1!'
    form.value.confirmPassword = 'StrongPass1!'
    await handleSubmit()
    expect(success.value).toBe(true)
  })

  it('sets serverError on API failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce({ data: { message: 'Expired' } })
    const { form, serverError, handleSubmit } = useResetPassword()
    form.value.newPassword = 'StrongPass1!'
    form.value.confirmPassword = 'StrongPass1!'
    await handleSubmit()
    expect(serverError.value).toBeTruthy()
  })
})
