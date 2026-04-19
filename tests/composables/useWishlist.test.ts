import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useWishlist } from '~/composables/useWishlist'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockItem = { id: 'wi-1', productId: 'prod-1', userId: 'u1', product: { id: 'prod-1', name: 'Test', price: 29.99 } }

describe('useWishlist', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseFetch.mockReturnValue({ data: ref([mockItem]), error: ref(null) })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('getWishlist calls useFetch with /wishlist', () => {
    useWishlist().getWishlist()
    expect(mockUseFetch.mock.calls[0][0]).toBe('/wishlist')
  })

  it('addToWishlist calls POST /wishlist with productId', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockItem)
    await useWishlist().addToWishlist('prod-1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/wishlist'), expect.objectContaining({ method: 'POST', body: { productId: 'prod-1' } }))
  })

  it('addToWishlist returns item on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockItem)
    const result = await useWishlist().addToWishlist('prod-1')
    expect(result.data).toEqual(mockItem)
    expect(result.error).toBeNull()
  })

  it('addToWishlist returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Conflict'))
    const result = await useWishlist().addToWishlist('prod-1')
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })

  it('removeFromWishlist calls DELETE /wishlist/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    await useWishlist().removeFromWishlist('wi-1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/wishlist/wi-1'), expect.objectContaining({ method: 'DELETE' }))
  })

  it('removeFromWishlist returns no error on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const result = await useWishlist().removeFromWishlist('wi-1')
    expect(result.error).toBeNull()
  })
})
