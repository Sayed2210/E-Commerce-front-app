import type { Category } from '~/types/api'
import { getAccessToken } from '~/utils/token'

interface CategoryForm {
  name: string
  slug?: string
  description?: string
  image?: string
  parentId?: string
}

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useCategoriesAdmin() {
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listCategories(params?: { page?: number; limit?: number }) {
    const query: Record<string, number> = {}
    if (params?.page) query.page = params.page
    if (params?.limit) query.limit = params.limit
    return useFetch<Category[]>('/categories', { baseURL, query, headers: authH() })
  }

  async function createCategory(dto: CategoryForm) {
    try {
      const data = await $fetch<Category>(`${baseURL}/categories`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      showSuccess(t('admin.categoriesPage.created'))
      return { data, error: null }
    } catch (err) {
      showError(err)
      return { data: null, error: err }
    }
  }

  async function updateCategory(id: string, dto: Partial<CategoryForm>) {
    try {
      const data = await $fetch<Category>(`${baseURL}/categories/${id}`, {
        method: 'PATCH',
        body: dto,
        headers: authH(),
      })
      showSuccess(t('admin.categoriesPage.updated'))
      return { data, error: null }
    } catch (err) {
      showError(err)
      return { data: null, error: err }
    }
  }

  async function deleteCategory(id: string) {
    try {
      await $fetch(`${baseURL}/categories/${id}`, { method: 'DELETE', headers: authH() })
      showSuccess(t('admin.categoriesPage.deleted'))
      return { error: null }
    } catch (err) {
      showError(err)
      return { error: err }
    }
  }

  return { listCategories, createCategory, updateCategory, deleteCategory }
}
