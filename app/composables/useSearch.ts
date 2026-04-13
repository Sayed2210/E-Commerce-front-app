import type { SearchResult } from '~/types/api'

export function useSearch() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function search(query: string, params?: { page?: number; limit?: number; category?: string }) {
    const qs = new URLSearchParams({ q: query })
    if (params?.page)     qs.set('page', String(params.page))
    if (params?.limit)    qs.set('limit', String(params.limit))
    if (params?.category) qs.set('category', params.category)
    return useFetch<SearchResult>(`${baseURL}/search?${qs.toString()}`)
  }

  return { search }
}
