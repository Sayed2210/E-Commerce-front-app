import { getAccessToken } from '~/utils/token'
import type { Return, CreateReturnDto, ProcessReturnDto } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export function useReturns() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listMyReturns() {
    return useFetch<Return[]>('/returns/my', { baseURL, headers: authH() })
  }

  function getReturn(id: string) {
    return useFetch<Return>(`/returns/${id}`, { baseURL, headers: authH() })
  }

  async function createReturn(dto: CreateReturnDto) {
    try {
      const data = await $fetch<Return>(`${baseURL}/returns`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function processReturn(id: string, dto: ProcessReturnDto) {
    try {
      const data = await $fetch<Return>(`${baseURL}/returns/${id}/process`, {
        method: 'PATCH',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  return { listMyReturns, getReturn, createReturn, processReturn }
}
