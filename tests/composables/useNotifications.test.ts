import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useNotifications } from '~/composables/useNotifications'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockNotif = { id: 'n1', userId: 'u1', type: 'order' as const, title: 'Shipped', message: 'On its way', isRead: false, createdAt: '2024-01-01T00:00:00Z' }

describe('useNotifications', () => {
  beforeEach(() => { vi.stubGlobal('$fetch', vi.fn()) })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('listNotifications calls GET /notifications with auth', async () => {
    vi.mocked($fetch).mockResolvedValueOnce([mockNotif])
    await useNotifications().listNotifications()
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/notifications'), expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }) }))
  })

  it('listNotifications returns data on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce([mockNotif])
    const result = await useNotifications().listNotifications()
    expect(result.data).toEqual([mockNotif])
    expect(result.error).toBeNull()
  })

  it('listNotifications returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Network'))
    const result = await useNotifications().listNotifications()
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })

  it('markAsRead calls PATCH /notifications/:id/read', async () => {
    vi.mocked($fetch).mockResolvedValueOnce({ ...mockNotif, isRead: true })
    await useNotifications().markAsRead('n1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/notifications/n1/read'), expect.objectContaining({ method: 'PATCH' }))
  })

  it('markAsRead returns updated notification', async () => {
    const updated = { ...mockNotif, isRead: true }
    vi.mocked($fetch).mockResolvedValueOnce(updated)
    const result = await useNotifications().markAsRead('n1')
    expect(result.data).toEqual(updated)
    expect(result.error).toBeNull()
  })

  it('markAllAsRead calls PATCH /notifications/read-all', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    await useNotifications().markAllAsRead()
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/notifications/read-all'), expect.objectContaining({ method: 'PATCH' }))
  })

  it('markAllAsRead returns no error on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const result = await useNotifications().markAllAsRead()
    expect(result.error).toBeNull()
  })

  it('markAllAsRead returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Server error'))
    const result = await useNotifications().markAllAsRead()
    expect(result.error).toBeDefined()
  })

  it('deleteNotification calls DELETE /notifications/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    await useNotifications().deleteNotification('n1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/notifications/n1'), expect.objectContaining({ method: 'DELETE' }))
  })

  it('deleteNotification returns no error on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const result = await useNotifications().deleteNotification('n1')
    expect(result.error).toBeNull()
  })
})
