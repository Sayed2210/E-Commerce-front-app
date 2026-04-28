import { getAccessToken } from '~/utils/token'
import type { Notification, CreateNotificationDto, PaginatedResponse } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useNotifications() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const { t } = useI18n()

  async function listNotifications() {
    try {
      const data = await $fetch<PaginatedResponse<Notification>>(`${baseURL}/notifications`, {
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function createNotification(dto: CreateNotificationDto) {
    try {
      const data = await $fetch<Notification>(`${baseURL}/notifications`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function markAsRead(id: string) {
    try {
      const data = await $fetch<Notification>(`${baseURL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function markAllAsRead() {
    try {
      await $fetch<undefined>(`${baseURL}/notifications/read-all`, {
        method: 'PATCH',
        headers: authH(),
      })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  async function deleteNotification(id: string) {
    try {
      await $fetch<undefined>(`${baseURL}/notifications/${id}`, {
        method: 'DELETE',
        headers: authH(),
      })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  function formatTimeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return t('notifications.timeAgoJustNow')
    if (m < 60) return t('notifications.timeAgoMinutes', m, { n: m })
    const h = Math.floor(m / 60)
    if (h < 24) return t('notifications.timeAgoHours', h, { n: h })
    const d = Math.floor(h / 24)
    return t('notifications.timeAgoDays', d, { n: d })
  }

  return {
    listNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    formatTimeAgo,
  }
}
