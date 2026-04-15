import { getAccessToken } from '~/utils/token'
import type { Review, CreateReviewDto, UpdateReviewDto } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useReviews() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function getProductReviews(productId: string) {
    return useFetch<Review[]>(`/reviews/product/${productId}`, { baseURL, headers: authH() })
  }

  async function createReview(dto: CreateReviewDto) {
    try {
      const data = await $fetch<Review>(`${baseURL}/reviews`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function updateReview(id: string, dto: UpdateReviewDto) {
    try {
      const data = await $fetch<Review>(`${baseURL}/reviews/${id}`, {
        method: 'PATCH',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function deleteReview(id: string) {
    try {
      await $fetch<undefined>(`${baseURL}/reviews/${id}`, { method: 'DELETE', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { getProductReviews, createReview, updateReview, deleteReview }
}
