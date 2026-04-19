import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'
import type { Cart, CartItem } from '~/types/api'

const mockCartItem: CartItem = {
  id: 'item-1',
  productId: 'prod-1',
  productName: 'Test Product',
  price: 29.99,
  quantity: 2,
  image: 'https://example.com/img.jpg',
}

const mockCart: Cart = {
  id: 'cart-1',
  userId: 'user-1',
  items: [mockCartItem],
  subtotal: 59.98,
  total: 59.98,
  discount: 0,
}

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with null cart and loading false', () => {
    const store = useCartStore()
    expect(store.cart).toBeNull()
    expect(store.loading).toBe(false)
  })

  describe('Getters', () => {
    it('returns empty array for items when cart is null', () => {
      const store = useCartStore()
      expect(store.items).toEqual([])
    })

    it('returns items from cart', () => {
      const store = useCartStore()
      store.setCart(mockCart)
      expect(store.items).toEqual([mockCartItem])
    })

    it('returns 0 for itemCount when cart is null', () => {
      const store = useCartStore()
      expect(store.itemCount).toBe(0)
    })

    it('sums quantities for itemCount', () => {
      const store = useCartStore()
      store.setCart(mockCart)
      expect(store.itemCount).toBe(2)
    })

    it('returns 0 for subtotal when cart is null', () => {
      const store = useCartStore()
      expect(store.subtotal).toBe(0)
    })

    it('returns subtotal from cart', () => {
      const store = useCartStore()
      store.setCart(mockCart)
      expect(store.subtotal).toBe(59.98)
    })

    it('returns 0 for total when cart is null', () => {
      const store = useCartStore()
      expect(store.total).toBe(0)
    })

    it('returns total from cart', () => {
      const store = useCartStore()
      store.setCart(mockCart)
      expect(store.total).toBe(59.98)
    })

    it('returns 0 for discount when cart is null', () => {
      const store = useCartStore()
      expect(store.discount).toBe(0)
    })

    it('returns discount from cart', () => {
      const store = useCartStore()
      store.setCart({ ...mockCart, discount: 10 })
      expect(store.discount).toBe(10)
    })

    it('isEmpty returns true when cart is null', () => {
      const store = useCartStore()
      expect(store.isEmpty).toBe(true)
    })

    it('isEmpty returns true when items array is empty', () => {
      const store = useCartStore()
      store.setCart({ ...mockCart, items: [] })
      expect(store.isEmpty).toBe(true)
    })

    it('isEmpty returns false when cart has items', () => {
      const store = useCartStore()
      store.setCart(mockCart)
      expect(store.isEmpty).toBe(false)
    })

    it('itemCount sums multiple items quantities', () => {
      const store = useCartStore()
      const cartWithMultiple: Cart = {
        ...mockCart,
        items: [
          { ...mockCartItem, quantity: 3 },
          { ...mockCartItem, id: 'item-2', quantity: 5 },
        ],
      }
      store.setCart(cartWithMultiple)
      expect(store.itemCount).toBe(8)
    })
  })

  describe('Actions', () => {
    it('setCart stores the cart', () => {
      const store = useCartStore()
      store.setCart(mockCart)
      expect(store.cart).toEqual(mockCart)
    })

    it('clearCart sets cart to null', () => {
      const store = useCartStore()
      store.setCart(mockCart)
      store.clearCart()
      expect(store.cart).toBeNull()
    })

    it('setLoading sets loading state', () => {
      const store = useCartStore()
      store.setLoading(true)
      expect(store.loading).toBe(true)
      store.setLoading(false)
      expect(store.loading).toBe(false)
    })
  })
})
