import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useOrders } from '~/composables/useOrders'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockOrder = { id: 'order-1', userId: 'u1', status: 'pending', total: 99.99, items: [], createdAt: '2024-01-01T00:00:00Z' }

describe('useOrders', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseFetch.mockReturnValue({ data: ref(null), error: ref(null), pending: ref(false) })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('listOrders calls useFetch with /orders', () => {
    useOrders().listOrders()
    expect(mockUseFetch.mock.calls[0][0]).toBe('/orders')
  })

  it('listOrders passes pagination params', () => {
    useOrders().listOrders({ page: 2, limit: 5 })
    expect(mockUseFetch.mock.calls[0][1]).toMatchObject({ query: { page: 2, limit: 5 } })
  })

  it('listOrders defaults to page 1 limit 10', () => {
    useOrders().listOrders()
    expect(mockUseFetch.mock.calls[0][1]).toMatchObject({ query: { page: 1, limit: 10 } })
  })

  it('getOrder calls useFetch with /orders/:id', () => {
    useOrders().getOrder('order-1')
    expect(mockUseFetch.mock.calls[0][0]).toBe('/orders/order-1')
  })

  it('updateOrderStatus calls PATCH /orders/:id/status', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ ...mockOrder, status: 'shipped' })
    await useOrders().updateOrderStatus('order-1', 'shipped')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/orders/order-1/status'), expect.objectContaining({ method: 'PATCH', body: { status: 'shipped' } }))
  })

  it('updateOrderStatus returns data on success', async () => {
    const updated = { ...mockOrder, status: 'delivered' }
    vi.mocked($fetch).mockResolvedValueOnce(updated)
    const result = await useOrders().updateOrderStatus('order-1', 'delivered')
    expect(result.data).toEqual(updated)
    expect(result.error).toBeNull()
  })

  it('updateOrderStatus returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Forbidden'))
    const result = await useOrders().updateOrderStatus('order-1', 'cancelled')
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })
})
