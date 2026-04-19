import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useCheckout } from '~/composables/useCheckout'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

describe('useCheckout', () => {
  beforeEach(() => { vi.stubGlobal('$fetch', vi.fn()) })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  describe('applyCoupon', () => {
    it('calls /checkout/apply-coupon with code', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({})
      await useCheckout().applyCoupon('PROMO20')
      expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/checkout/apply-coupon'), expect.objectContaining({ method: 'POST', body: { code: 'PROMO20' } }))
    })

    it('sends Authorization header', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({})
      await useCheckout().applyCoupon('CODE')
      expect($fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }) }))
    })

    it('returns data on success', async () => {
      const mockResponse = { discount: 10, discountType: 'percentage', code: 'SAVE10' }
      vi.mocked($fetch).mockResolvedValueOnce(mockResponse)
      const result = await useCheckout().applyCoupon('SAVE10')
      expect(result.data).toEqual(mockResponse)
      expect(result.error).toBeNull()
    })

    it('returns error on failure', async () => {
      vi.mocked($fetch).mockRejectedValueOnce(new Error('Invalid coupon'))
      const result = await useCheckout().applyCoupon('BAD')
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
    })
  })

  describe('createOrder', () => {
    const mockDto = { addressId: 'addr-1', paymentMethod: 'cod' as const }

    it('calls /checkout/create-order endpoint', async () => {
      vi.mocked($fetch).mockResolvedValueOnce({})
      await useCheckout().createOrder(mockDto)
      expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/checkout/create-order'), expect.objectContaining({ method: 'POST', body: mockDto }))
    })

    it('returns order data on success', async () => {
      const mockOrder = { order: { id: 'order-1', status: 'pending' } }
      vi.mocked($fetch).mockResolvedValueOnce(mockOrder)
      const result = await useCheckout().createOrder(mockDto)
      expect(result.data).toEqual(mockOrder)
      expect(result.error).toBeNull()
    })

    it('returns error on failure', async () => {
      vi.mocked($fetch).mockRejectedValueOnce(new Error('Payment failed'))
      const result = await useCheckout().createOrder(mockDto)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
    })
  })
})
