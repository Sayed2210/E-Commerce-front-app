import { io } from 'socket.io-client'
import { getAccessToken } from '~/utils/token'
import type { Cart, Notification, NotificationType } from '~/types/api'
import { useNotificationsStore } from '~/stores/notifications'

type NotificationSocketDto = {
  id: string
  type: string
  title: string
  message?: string
  data?: Record<string, unknown>
  readAt?: string | Date
  userId: string
  createdAt: string | Date
}

const NOTIFICATION_TYPES: NotificationType[] = ['order', 'promo', 'system', 'review']

function toIsoString(dateValue: string | Date | undefined): string {
  if (!dateValue) return new Date().toISOString()
  if (dateValue instanceof Date) return dateValue.toISOString()
  return dateValue
}

function normalizeNotification(payload: NotificationSocketDto): Notification {
  return {
    id: payload.id,
    userId: payload.userId,
    type: NOTIFICATION_TYPES.includes(payload.type as NotificationType)
      ? (payload.type as NotificationType)
      : 'system',
    title: payload.title,
    message: payload.message ?? '',
    isRead: Boolean(payload.readAt),
    data: payload.data,
    createdAt: toIsoString(payload.createdAt),
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const notificationsStore = useNotificationsStore()
  const cartStore = useCartStore()

  let socket: ReturnType<typeof io> | null = null

  function connect() {
    const token = getAccessToken()
    if (!token || socket?.connected) return

    const authorization = `Bearer ${token}`

    socket = io(config.public.apiBaseUrl as string, {
      auth: { token },
      extraHeaders: { authorization },
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnectionAttempts: 5,
    })

    socket.on('newNotification', (data: NotificationSocketDto) => {
      notificationsStore.prepend(normalizeNotification(data))
    })

    socket.on('notification', (data: NotificationSocketDto | Notification) => {
      const normalized = 'isRead' in data ? data : normalizeNotification(data)
      notificationsStore.prepend(normalized)
    })

    socket.on('cart_updated', (cart: Cart) => {
      cartStore.setCart(cart)
    })

    socket.on('connect_error', (err: Error) => {
      console.warn('[socket] connection error:', err.message)
    })

    socket.on('error', (err: Error) => {
      console.error('[socket] error:', err.message)
    })
  }

  function disconnect() {
    socket?.disconnect()
    socket = null
  }

  watch(
    () => authStore.isAuthenticated,
    (authenticated) => {
      if (authenticated) connect()
      else disconnect()
    },
    { immediate: true }
  )

  return {
    provide: {},
  }
})
