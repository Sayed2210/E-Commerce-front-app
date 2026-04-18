import { io } from 'socket.io-client'
import { getAccessToken } from '~/utils/token'
import type { Notification } from '~/types/api'
import { useNotificationsStore } from '~/stores/notifications'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const notificationsStore = useNotificationsStore()

  let socket: ReturnType<typeof io> | null = null

  function connect() {
    const token = getAccessToken()
    if (!token || socket?.connected) return

    socket = io(config.public.apiBaseUrl as string, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    })

    socket.on('notification', (data: Notification) => {
      notificationsStore.prepend(data)
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
})
