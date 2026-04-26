import { defineStore } from 'pinia'
import { UserRole } from '~/types/auth'
import type { User } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === UserRole.ADMIN || false,
    currentUser: (state) => state.user,
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    clearUser() {
      this.user = null
    },
  },

  persist: {
    pick: ['user'],
  },
})
