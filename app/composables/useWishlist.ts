import { getAccessToken } from '~/utils/token'
import type { WishlistItem } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useWishlist() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function getWishlist() {
    return useFetch<WishlistItem[]>('/wishlist', { baseURL, headers: authH() })
  }

  async function addToWishlist(productId: string) {
    try {
      const data = await $fetch<WishlistItem>(`${baseURL}/wishlist`, {
        method: 'POST',
        body: { productId },
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function removeFromWishlist(productId: string) {
    try {
      await $fetch<undefined>(`${baseURL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: authH(),
      })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  async function clearWishlist() {
    try {
      await $fetch<undefined>(`${baseURL}/wishlist`, { method: 'DELETE', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { getWishlist, addToWishlist, removeFromWishlist, clearWishlist }
}
