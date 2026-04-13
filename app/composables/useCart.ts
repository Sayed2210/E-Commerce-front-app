import { getAccessToken } from '~/utils/token'
import type { Cart, AddCartItemDto, UpdateCartItemDto } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useCart() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const cartStore = useCartStore()

  async function fetchCart() {
    const { data, error } = await useFetch<Cart>('/cart', { baseURL, headers: authH() })
    if (data.value) cartStore.setCart(data.value as unknown as Cart)
    return { data, error }
  }

  async function addItem(dto: AddCartItemDto) {
    try {
      const data = await $fetch<Cart>(`${baseURL}/cart/items`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      if (data) cartStore.setCart(data as Cart)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function updateItem(itemId: string, dto: UpdateCartItemDto) {
    try {
      const data = await $fetch<Cart>(`${baseURL}/cart/items/${itemId}`, {
        method: 'PATCH',
        body: dto,
        headers: authH(),
      })
      if (data) cartStore.setCart(data as Cart)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function removeItem(itemId: string) {
    try {
      const data = await $fetch<Cart>(`${baseURL}/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: authH(),
      })
      if (data) cartStore.setCart(data as Cart)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function clearCart() {
    try {
      await $fetch<undefined>(`${baseURL}/cart`, { method: 'DELETE', headers: authH() })
      cartStore.clearCart()
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { fetchCart, addItem, updateItem, removeItem, clearCart }
}
