import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from '~/stores/notifications'
import type { Notification } from '~/types/api'

const makeNotif = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'notif-1',
  userId: 'user-1',
  type: 'order',
  title: 'Order Shipped',
  message: 'Your order is on the way.',
  isRead: false,
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

describe('Notifications Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty items and loaded false', () => {
    const store = useNotificationsStore()
    expect(store.items).toEqual([])
    expect(store.loaded).toBe(false)
  })

  describe('Getters', () => {
    it('unreadCount returns 0 with no items', () => {
      const store = useNotificationsStore()
      expect(store.unreadCount).toBe(0)
    })

    it('unreadCount counts only unread items', () => {
      const store = useNotificationsStore()
      store.setAll([
        makeNotif({ id: '1', isRead: false }),
        makeNotif({ id: '2', isRead: true }),
        makeNotif({ id: '3', isRead: false }),
      ])
      expect(store.unreadCount).toBe(2)
    })

    it('recent returns up to 5 items', () => {
      const store = useNotificationsStore()
      const items = Array.from({ length: 8 }, (_, i) =>
        makeNotif({ id: `notif-${i}`, title: `Notif ${i}` })
      )
      store.setAll(items)
      expect(store.recent).toHaveLength(5)
    })

    it('recent returns the first 5 items in order', () => {
      const store = useNotificationsStore()
      const items = Array.from({ length: 6 }, (_, i) =>
        makeNotif({ id: `notif-${i}`, title: `Notif ${i}` })
      )
      store.setAll(items)
      expect(store.recent[0].id).toBe('notif-0')
      expect(store.recent[4].id).toBe('notif-4')
    })

    it('recent returns all items when fewer than 5', () => {
      const store = useNotificationsStore()
      store.setAll([makeNotif({ id: '1' }), makeNotif({ id: '2' })])
      expect(store.recent).toHaveLength(2)
    })
  })

  describe('Actions', () => {
    it('setAll replaces items and sets loaded true', () => {
      const store = useNotificationsStore()
      const notifs = [makeNotif({ id: '1' }), makeNotif({ id: '2' })]
      store.setAll(notifs)
      expect(store.items).toEqual(notifs)
      expect(store.loaded).toBe(true)
    })

    it('prepend adds notification to front', () => {
      const store = useNotificationsStore()
      store.setAll([makeNotif({ id: 'old' })])
      store.prepend(makeNotif({ id: 'new', title: 'New Notif' }))
      expect(store.items[0].id).toBe('new')
      expect(store.items).toHaveLength(2)
    })

    it('markRead marks a notification as read', () => {
      const store = useNotificationsStore()
      store.setAll([makeNotif({ id: 'n1', isRead: false })])
      store.markRead('n1')
      expect(store.items[0].isRead).toBe(true)
    })

    it('markRead does nothing for unknown id', () => {
      const store = useNotificationsStore()
      store.setAll([makeNotif({ id: 'n1', isRead: false })])
      store.markRead('unknown')
      expect(store.items[0].isRead).toBe(false)
    })

    it('markAllRead marks all notifications as read', () => {
      const store = useNotificationsStore()
      store.setAll([
        makeNotif({ id: '1', isRead: false }),
        makeNotif({ id: '2', isRead: false }),
      ])
      store.markAllRead()
      expect(store.items.every((n) => n.isRead)).toBe(true)
      expect(store.unreadCount).toBe(0)
    })

    it('remove deletes notification by id', () => {
      const store = useNotificationsStore()
      store.setAll([makeNotif({ id: '1' }), makeNotif({ id: '2' })])
      store.remove('1')
      expect(store.items).toHaveLength(1)
      expect(store.items[0].id).toBe('2')
    })

    it('remove does nothing for unknown id', () => {
      const store = useNotificationsStore()
      store.setAll([makeNotif({ id: '1' })])
      store.remove('unknown')
      expect(store.items).toHaveLength(1)
    })
  })
})
