import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { mockUser, mockAdminUser } from '../utils/testUtils'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with null user and loading false', () => {
    const store = useAuthStore()

    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
  })

  describe('Getters', () => {
    it('should return false for isAuthenticated when no user', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should return true for isAuthenticated when user exists', () => {
      const store = useAuthStore()
      store.setUser(mockUser)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should return false for isAdmin for regular user', () => {
      const store = useAuthStore()
      store.setUser(mockUser)
      expect(store.isAdmin).toBe(false)
    })

    it('should return true for isAdmin for admin user', () => {
      const store = useAuthStore()
      store.setUser(mockAdminUser)
      expect(store.isAdmin).toBe(true)
    })

    it('should return current user', () => {
      const store = useAuthStore()
      store.setUser(mockUser)
      expect(store.currentUser).toEqual(mockUser)
    })
  })

  describe('Actions', () => {
    it('should set user', () => {
      const store = useAuthStore()
      store.setUser(mockUser)
      expect(store.user).toEqual(mockUser)
    })

    it('should set loading state', () => {
      const store = useAuthStore()
      store.setLoading(true)
      expect(store.loading).toBe(true)
    })

    it('should clear user', () => {
      const store = useAuthStore()
      store.setUser(mockUser)
      store.clearUser()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })
})
