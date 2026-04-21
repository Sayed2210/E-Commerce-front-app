import { defineStore } from 'pinia'
import type { Notification } from '~/types/api'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [] as Notification[],
    loaded: false,
  }),

  getters: {
    unreadCount: (state): number => (state.items ? state.items.filter((n) => !n.isRead).length : 0),
    recent: (state): Notification[] => state.items?.slice(0, 5) ?? [],
  },

  actions: {
    setAll(notifications: Notification[]) {
      this.items = notifications
      this.loaded = true
    },

    prepend(notification: Notification) {
      this.items.unshift(notification)
    },

    markRead(id: string) {
      const n = this.items.find((n) => n.id === id)
      if (n) n.isRead = true
    },

    markAllRead() {
      this.items.forEach((n) => (n.isRead = true))
    },

    remove(id: string) {
      this.items = this.items.filter((n) => n.id !== id)
    },
  },
})
