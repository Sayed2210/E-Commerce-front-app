import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useNewsletter } from '~/composables/useNewsletter'

mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

describe('useNewsletter', () => {
  beforeEach(() => { vi.stubGlobal('$fetch', vi.fn()) })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('initializes with empty email and name', () => {
    const { email, name } = useNewsletter()
    expect(email.value).toBe('')
    expect(name.value).toBe('')
  })

  it('initializes sent false and loading false', () => {
    const { sent, loading } = useNewsletter()
    expect(sent.value).toBe(false)
    expect(loading.value).toBe(false)
  })

  it('does nothing when email is empty', async () => {
    const { email, submit } = useNewsletter()
    email.value = ''
    await submit()
    expect($fetch).not.toHaveBeenCalled()
  })

  it('does nothing when email is only whitespace', async () => {
    const { email, submit } = useNewsletter()
    email.value = '   '
    await submit()
    expect($fetch).not.toHaveBeenCalled()
  })

  it('calls POST /newsletter/subscribe', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { email, submit } = useNewsletter()
    email.value = 'user@example.com'
    await submit()
    expect($fetch).toHaveBeenCalledWith('/newsletter/subscribe', expect.objectContaining({ method: 'POST', body: expect.objectContaining({ email: 'user@example.com' }) }))
  })

  it('includes name in body when provided', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { email, name, submit } = useNewsletter()
    email.value = 'user@example.com'
    name.value = 'Alice'
    await submit()
    const body = (vi.mocked($fetch).mock.calls[0][1] as any).body
    expect(body.name).toBe('Alice')
  })

  it('omits name from body when name is empty', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { email, name, submit } = useNewsletter()
    email.value = 'user@example.com'
    name.value = ''
    await submit()
    const body = (vi.mocked($fetch).mock.calls[0][1] as any).body
    expect(body.name).toBeUndefined()
  })

  it('sets sent to true on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const { email, sent, submit } = useNewsletter()
    email.value = 'user@example.com'
    await submit()
    expect(sent.value).toBe(true)
  })

  it('sets loading false after submission regardless of outcome', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Network'))
    const { email, loading, submit } = useNewsletter()
    email.value = 'user@example.com'
    try { await submit() } catch { /* expected */ }
    expect(loading.value).toBe(false)
  })
})
