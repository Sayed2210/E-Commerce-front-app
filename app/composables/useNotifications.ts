import { getAccessToken } from '~/utils/token'
import type { Notification, CreateNotificationDto } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useNotifications() {
  const config  = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listNotifications() {
    return useFetch<Notification[]>('/notifications', { baseURL, headers: authH() })
  }

  async function createNotification(dto: CreateNotificationDto) {
    try {
      const data = await $fetch<Notification>(`${baseURL}/notifications`, {
        method: 'POST', body: dto, headers: authH()
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function markAsRead(id: string) {
    try {
      const data = await $fetch<Notification>(`${baseURL}/notifications/${id}/read`, {
        method: 'PATCH', headers: authH()
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function markAllAsRead() {
    try {
      await $fetch<void>(`${baseURL}/notifications/read-all`, { method: 'PATCH', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  async function deleteNotification(id: string) {
    try {
      await $fetch<void>(`${baseURL}/notifications/${id}`, { method: 'DELETE', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { listNotifications, createNotification, markAsRead, markAllAsRead, deleteNotification }
}

