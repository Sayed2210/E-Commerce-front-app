import type { Brand } from '~/types/api'
import { getAccessToken } from '~/utils/token'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useBrands() {
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listBrands(params?: { page?: number; limit?: number }) {
    const query: Record<string, number> = {}
    if (params?.page) query.page = params.page
    if (params?.limit) query.limit = params.limit
    return useFetch<Brand[]>('/brands', { baseURL, query, headers: authH() })
  }

  function getBrand(id: string) {
    return useFetch<Brand>(`/brands/${id}`, { baseURL, headers: authH() })
  }

  async function createBrand(form: { name: string; slug?: string; logo?: string }) {
    try {
      const data = await $fetch<Brand>(`${baseURL}/brands`, {
        method: 'POST',
        body: form,
        headers: authH(),
      })
      showSuccess(t('admin.brandsPage.created'))
      return { data, error: null }
    } catch (err) {
      showError(err)
      return { data: null, error: err }
    }
  }

  async function updateBrand(id: string, form: { name?: string; slug?: string; logo?: string }) {
    try {
      const data = await $fetch<Brand>(`${baseURL}/brands/${id}`, {
        method: 'PATCH',
        body: form,
        headers: authH(),
      })
      showSuccess(t('admin.brandsPage.updated'))
      return { data, error: null }
    } catch (err) {
      showError(err)
      return { data: null, error: err }
    }
  }

  async function deleteBrand(id: string) {
    try {
      await $fetch(`${baseURL}/brands/${id}`, { method: 'DELETE', headers: authH() })
      showSuccess(t('admin.brandsPage.deleted'))
      return { error: null }
    } catch (err) {
      showError(err)
      return { error: err }
    }
  }

  return { listBrands, getBrand, createBrand, updateBrand, deleteBrand }
}
