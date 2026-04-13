import { getAccessToken } from '~/utils/token'
import type { DashboardStats, StaffMember, CreateStaffDto, AuditLog, PaginatedResponse, User } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useAdmin() {
  const config  = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function getDashboardStats() {
    return useFetch<DashboardStats>('/admin/analytics/dashboard-stats', { baseURL, headers: authH() })
  }

  function listUsers(params?: { page?: number; limit?: number }) {
    return useFetch<PaginatedResponse<User>>('/users', {
      baseURL,
      query: { page: params?.page ?? 1, limit: params?.limit ?? 10 },
      headers: authH()
    })
  }

  async function deleteUser(id: string) {
    try {
      await $fetch<void>(`${baseURL}/users/${id}`, { method: 'DELETE', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  function listStaff() {
    return useFetch<StaffMember[]>('/admin/staff', { baseURL, headers: authH() })
  }

  async function createStaff(dto: CreateStaffDto) {
    try {
      const data = await $fetch<StaffMember>(`${baseURL}/admin/staff`, {
        method: 'POST', body: dto, headers: authH()
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function deleteStaff(id: string) {
    try {
      await $fetch<void>(`${baseURL}/admin/staff/${id}`, { method: 'DELETE', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  function getAuditLogs(params?: { page?: number; limit?: number }) {
    return useFetch<PaginatedResponse<AuditLog>>('/admin/analytics/audit-logs', {
      baseURL,
      query: { page: params?.page ?? 1, limit: params?.limit ?? 20 },
      headers: authH()
    })
  }

  return { getDashboardStats, listUsers, deleteUser, listStaff, createStaff, deleteStaff, getAuditLogs }
}

