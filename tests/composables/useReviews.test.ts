import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useReviews } from '~/composables/useReviews'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockReview = { id: 'rev-1', productId: 'prod-1', userId: 'u1', rating: 5, comment: 'Great!', createdAt: '2024-01-01T00:00:00Z' }

describe('useReviews', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseFetch.mockReturnValue({ data: ref([mockReview]), error: ref(null) })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('getProductReviews calls useFetch with /reviews/product/:id', () => {
    useReviews().getProductReviews('prod-1')
    expect(mockUseFetch.mock.calls[0][0]).toBe('/reviews/product/prod-1')
  })

  it('createReview calls POST /reviews', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockReview)
    await useReviews().createReview({ productId: 'prod-1', rating: 5, comment: 'Great!' })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/reviews'), expect.objectContaining({ method: 'POST', body: { productId: 'prod-1', rating: 5, comment: 'Great!' } }))
  })

  it('createReview returns data on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockReview)
    const result = await useReviews().createReview({ productId: 'prod-1', rating: 5, comment: 'Great!' })
    expect(result.data).toEqual(mockReview)
    expect(result.error).toBeNull()
  })

  it('createReview returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Already reviewed'))
    const result = await useReviews().createReview({ productId: 'prod-1', rating: 5, comment: '' })
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })

  it('updateReview calls PATCH /reviews/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ ...mockReview, rating: 4 })
    await useReviews().updateReview('rev-1', { rating: 4 })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/reviews/rev-1'), expect.objectContaining({ method: 'PATCH', body: { rating: 4 } }))
  })

  it('deleteReview calls DELETE /reviews/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    await useReviews().deleteReview('rev-1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/reviews/rev-1'), expect.objectContaining({ method: 'DELETE' }))
  })

  it('deleteReview returns no error on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const result = await useReviews().deleteReview('rev-1')
    expect(result.error).toBeNull()
  })
})
