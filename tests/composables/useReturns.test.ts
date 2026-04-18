import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useReturns } from '~/composables/useReturns'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockReturn = { id: 'ret-1', orderId: 'order-1', reason: 'defective', status: 'pending', createdAt: '2024-01-01T00:00:00Z' }

describe('useReturns', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseFetch.mockReturnValue({ data: ref(null), error: ref(null) })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('listMyReturns calls useFetch with /returns/my', () => {
    useReturns().listMyReturns()
    expect(mockUseFetch.mock.calls[0][0]).toBe('/returns/my')
  })

  it('getReturn calls useFetch with /returns/:id', () => {
    useReturns().getReturn('ret-1')
    expect(mockUseFetch.mock.calls[0][0]).toBe('/returns/ret-1')
  })

  it('createReturn calls POST /returns', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockReturn)
    await useReturns().createReturn({ orderId: 'o1', reason: 'defective', notes: '' })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/returns'), expect.objectContaining({ method: 'POST' }))
  })

  it('createReturn returns data on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockReturn)
    const result = await useReturns().createReturn({ orderId: 'o1', reason: 'defective', notes: '' })
    expect(result.data).toEqual(mockReturn)
    expect(result.error).toBeNull()
  })

  it('createReturn returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Bad request'))
    const result = await useReturns().createReturn({ orderId: 'o1', reason: 'defective', notes: '' })
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })

  it('processReturn calls PATCH /returns/:id/process', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ ...mockReturn, status: 'approved' })
    await useReturns().processReturn('ret-1', { status: 'approved', notes: 'OK' })
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining('/returns/ret-1/process'),
      expect.objectContaining({ method: 'PATCH', body: { status: 'approved', notes: 'OK' } })
    )
  })

  it('processReturn returns data on success', async () => {
    const processed = { ...mockReturn, status: 'approved' }
    vi.mocked($fetch).mockResolvedValueOnce(processed)
    const result = await useReturns().processReturn('ret-1', { status: 'approved' })
    expect(result.data).toEqual(processed)
    expect(result.error).toBeNull()
  })
})
