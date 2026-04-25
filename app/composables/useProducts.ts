import { getAccessToken } from '~/utils/token'
import type { Product, CreateProductDto, UpdateProductDto, PaginatedResponse } from '~/types/api'
import type { MaybeRefOrGetter } from 'vue'

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
    page?: MaybeRefOrGetter<number | undefined>
    limit?: MaybeRefOrGetter<number | undefined>
    categoryId?: MaybeRefOrGetter<string | undefined>
    brandId?: MaybeRefOrGetter<string | undefined>
    search?: MaybeRefOrGetter<string | undefined>
    minPrice?: MaybeRefOrGetter<number | undefined>
    maxPrice?: MaybeRefOrGetter<number | undefined>
    sort?: MaybeRefOrGetter<string | undefined>
  }) {
    const query = computed(() => {
      const q: Record<string, string | number> = {}
      const page = toValue(params?.page)
      const limit = toValue(params?.limit)
      const categoryId = toValue(params?.categoryId)
      const brandId = toValue(params?.brandId)
      const search = toValue(params?.search)
      const sort = toValue(params?.sort)
      const minPrice = toValue(params?.minPrice)
      const maxPrice = toValue(params?.maxPrice)

      if (page) q.page = page
      if (limit) q.limit = limit
      if (categoryId) q.categoryId = categoryId
      if (brandId) q.brandId = brandId
      if (search) q.search = search
      if (sort) q.sortBy = sort
      if (minPrice) q.minPrice = minPrice
      if (maxPrice) q.maxPrice = maxPrice

      return q
    })
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
