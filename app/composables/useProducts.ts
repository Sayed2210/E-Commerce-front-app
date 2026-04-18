import { getAccessToken } from '~/utils/token'
import type { Product, CreateProductDto, UpdateProductDto, PaginatedResponse } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useProducts() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listProducts(params?: {
    page?: number
    limit?: number
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
  }) {
    const query: Record<string, string | number> = {}
    if (params?.page) query.page = params.page
    if (params?.limit) query.limit = params.limit
    if (params?.categoryId) query.categoryId = params.categoryId
    if (params?.sort) query.sortBy = params.sort
    if (params?.minPrice) query.minPrice = params.minPrice
    if (params?.maxPrice) query.maxPrice = params.maxPrice
    return useFetch<PaginatedResponse<Product>>('/products', { baseURL, query, headers: authH() })
  }

  function getProduct(id: string) {
    return useFetch<Product>(`/products/${id}`, { baseURL, headers: authH() })
  }

  async function createProduct(dto: CreateProductDto) {
    try {
      const data = await $fetch<Product>(`${baseURL}/products`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function updateProduct(id: string, dto: UpdateProductDto) {
    try {
      const data = await $fetch<Product>(`${baseURL}/products/${id}`, {
        method: 'PATCH',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function deleteProduct(id: string) {
    try {
      await $fetch<undefined>(`${baseURL}/products/${id}`, { method: 'DELETE', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { listProducts, getProduct, createProduct, updateProduct, deleteProduct }
}
