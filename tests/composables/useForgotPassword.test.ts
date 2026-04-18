import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useForgotPassword } from '~/composables/useForgotPassword'

mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

describe('useForgotPassword', () => {
  beforeEach(() => { vi.stubGlobal('$fetch', vi.fn()) })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('initializes with empty form and no errors', () => {
    const { form, errors, loading, submitted, serverError } = useForgotPassword()
    expect(form.value.email).toBe('')
    expect(errors.value).toEqual({})
    expect(loading.value).toBe(false)
    expect(submitted.value).toBe(false)
    expect(serverError.value).toBe('')
  })

  it('sets error for invalid email without calling API', async () => {
    const { form, errors, handleSubmit } = useForgotPassword()
    form.value.email = 'not-an-email'
    await handleSubmit()
    expect(errors.value.email).toBeDefined()
    expect($fetch).not.toHaveBeenCalled()
  })

  it('does not submit when email is empty', async () => {
    const { form, handleSubmit } = useForgotPassword()
    form.value.email = ''
    await handleSubmit()
    expect($fetch).not.toHaveBeenCalled()
  })

  it('calls POST /auth/forgot-password with valid email', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { form, handleSubmit } = useForgotPassword()
    form.value.email = 'user@example.com'
    await handleSubmit()
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/forgot-password'), expect.objectContaining({ method: 'POST', body: { email: 'user@example.com' } }))
  })

  it('sets submitted to true on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { form, submitted, handleSubmit } = useForgotPassword()
    form.value.email = 'user@example.com'
    await handleSubmit()
    expect(submitted.value).toBe(true)
  })

  it('sets serverError on API failure and loading stays false', async () => {
    vi.mocked($fetch).mockRejectedValueOnce({ data: { message: 'Not found' } })
    const { form, serverError, loading, handleSubmit } = useForgotPassword()
    form.value.email = 'x@example.com'
    await handleSubmit()
    expect(serverError.value).toBeTruthy()
    expect(loading.value).toBe(false)
  })
})
