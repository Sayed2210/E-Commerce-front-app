import type { Tag, CreateTagDto } from '~/types/api'
import { showSuccessToast, showErrorToast } from '~/utils/errorHandler'
import { getAccessToken } from '~/utils/token'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useTags() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listTags(params?: { page?: number; limit?: number }) {
    const query: Record<string, number> = {}
    if (params?.page) query.page = params.page
    if (params?.limit) query.limit = params.limit
    return useFetch<Tag[]>('/tags', { baseURL, query, headers: authH() })
  }

  async function createTag(form: CreateTagDto) {
    try {
      const data = await $fetch<Tag>(`${baseURL}/tags`, {
        method: 'POST',
        body: form,
        headers: authH(),
      })
      showSuccessToast('Tag created.')
      return { data, error: null }
    } catch (err) {
      showErrorToast(err)
      return { data: null, error: err }
    }
  }

  async function deleteTag(id: string) {
    try {
      await $fetch(`${baseURL}/tags/${id}`, { method: 'DELETE', headers: authH() })
      showSuccessToast('Tag deleted.')
      return { error: null }
    } catch (err) {
      showErrorToast(err)
      return { error: err }
    }
  }

  return { listTags, createTag, deleteTag }
}
