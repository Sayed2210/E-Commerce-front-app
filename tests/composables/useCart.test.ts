import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useCart } from '~/composables/useCart'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockCart = { id: 'cart-1', userId: 'u1', items: [], subtotal: 0, total: 0, discount: 0 }

describe('useCart', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('$fetch', vi.fn())
    mockUseFetch.mockReturnValue({ data: ref(mockCart), error: ref(null), pending: ref(false) })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('fetchCart calls useFetch with /cart', async () => {
    await useCart().fetchCart()
    expect(mockUseFetch.mock.calls[0][0]).toBe('/cart')
  })

  it('addItem calls POST /cart/items', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockCart)
    await useCart().addItem({ productId: 'prod-1', quantity: 1 })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/cart/items'), expect.objectContaining({ method: 'POST', body: { productId: 'prod-1', quantity: 1 } }))
  })

  it('addItem returns cart on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockCart)
    const result = await useCart().addItem({ productId: 'prod-1', quantity: 2 })
    expect(result.data).toEqual(mockCart)
    expect(result.error).toBeNull()
  })

  it('addItem returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Out of stock'))
    const result = await useCart().addItem({ productId: 'prod-1', quantity: 1 })
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })

  it('updateItem calls PATCH /cart/items/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockCart)
    await useCart().updateItem('item-1', { quantity: 3 })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/cart/items/item-1'), expect.objectContaining({ method: 'PATCH', body: { quantity: 3 } }))
  })

  it('removeItem calls DELETE /cart/items/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockCart)
    await useCart().removeItem('item-1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/cart/items/item-1'), expect.objectContaining({ method: 'DELETE' }))
  })

  it('clearCart calls DELETE /cart', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    await useCart().clearCart()
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/cart'), expect.objectContaining({ method: 'DELETE' }))
  })

  it('clearCart returns no error on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const result = await useCart().clearCart()
    expect(result.error).toBeNull()
  })
})
