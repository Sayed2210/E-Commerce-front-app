import { defineStore } from 'pinia'
import type { Cart, CartItem } from '~/types/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null as Cart | null,
    loading: false,
  }),

  getters: {
    items: (state): CartItem[] => state.cart?.items ?? [],
    itemCount: (state): number => state.cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
    subtotal: (state): number => state.cart?.subtotal ?? 0,
    total: (state): number => state.cart?.total ?? 0,
    discount: (state): number => state.cart?.discount ?? 0,
    isEmpty: (state): boolean => !state.cart?.items.length,
  },

  actions: {
    setCart(cart: Cart) {
      this.cart = cart
    },
    clearCart() {
      this.cart = null
    },
    setLoading(val: boolean) {
      this.loading = val
    },
  },
})
