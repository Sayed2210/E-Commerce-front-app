import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useProducts } from '~/composables/useProducts'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockProduct = { id: 'prod-1', name: 'Test Product', price: 49.99, isActive: true, stock: 100 }

describe('useProducts', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseFetch.mockReturnValue({ data: ref(null), error: ref(null), pending: ref(false) })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('listProducts calls useFetch with /products', () => {
    useProducts().listProducts()
    expect(mockUseFetch.mock.calls[0][0]).toBe('/products')
  })

  it('listProducts passes page and limit', () => {
    useProducts().listProducts({ page: 2, limit: 12 })
    expect(mockUseFetch.mock.calls[0][1]).toMatchObject({ query: { page: 2, limit: 12 } })
  })

  it('listProducts passes categoryId', () => {
    useProducts().listProducts({ categoryId: 'cat-1' })
    expect(mockUseFetch.mock.calls[0][1].query).toMatchObject({ categoryId: 'cat-1' })
  })

  it('listProducts maps sort to sortBy', () => {
    useProducts().listProducts({ sort: 'price_asc' })
    expect(mockUseFetch.mock.calls[0][1].query).toMatchObject({ sortBy: 'price_asc' })
  })

  it('listProducts passes price range', () => {
    useProducts().listProducts({ minPrice: 10, maxPrice: 100 })
    expect(mockUseFetch.mock.calls[0][1].query).toMatchObject({ minPrice: 10, maxPrice: 100 })
  })

  it('listProducts omits undefined params', () => {
    useProducts().listProducts()
    const q = mockUseFetch.mock.calls[0][1].query
    expect(q.categoryId).toBeUndefined()
    expect(q.sortBy).toBeUndefined()
  })

  it('getProduct calls useFetch with /products/:id', () => {
    useProducts().getProduct('prod-1')
    expect(mockUseFetch.mock.calls[0][0]).toBe('/products/prod-1')
  })

  it('createProduct calls POST /products', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockProduct)
    await useProducts().createProduct({ name: 'T', price: 10, stock: 5 })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/products'), expect.objectContaining({ method: 'POST' }))
  })

  it('createProduct returns data on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockProduct)
    const result = await useProducts().createProduct({ name: 'T', price: 10, stock: 5 })
    expect(result.data).toEqual(mockProduct)
    expect(result.error).toBeNull()
  })

  it('updateProduct calls PATCH /products/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ ...mockProduct, price: 59.99 })
    await useProducts().updateProduct('prod-1', { price: 59.99 })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/products/prod-1'), expect.objectContaining({ method: 'PATCH', body: { price: 59.99 } }))
  })

  it('deleteProduct calls DELETE /products/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    await useProducts().deleteProduct('prod-1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/products/prod-1'), expect.objectContaining({ method: 'DELETE' }))
  })
})
