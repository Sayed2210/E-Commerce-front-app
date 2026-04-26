import { getAccessToken } from '~/utils/token'
import type { Order, PaginatedResponse, DashboardStats } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useOrders() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listOrders(params?: { page?: number; limit?: number; status?: string }) {
    const query: Record<string, string | number> = {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    }
    if (params?.status) query.status = params.status
    return useFetch<PaginatedResponse<Order>>('/orders', { baseURL, query, headers: authH() })
  }

  function getOrder(id: string) {
    return useFetch<Order>(`/orders/${id}`, { baseURL, headers: authH() })
  }

  async function updateOrderStatus(id: string, status: string) {
    try {
      const data = await $fetch<Order>(`${baseURL}/orders/${id}/status`, {
        method: 'PATCH',
        body: { status },
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  function getOrderAnalytics() {
    return useFetch<DashboardStats>('/orders/analytics/summary', { baseURL, headers: authH() })
  }

  return { listOrders, getOrder, updateOrderStatus, getOrderAnalytics }
}
