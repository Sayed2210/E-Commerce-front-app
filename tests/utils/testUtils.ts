import { vi } from 'vitest'
import type { Router } from 'vue-router'

/**
 * Mock Nuxt router
 */
export function createMockRouter(): Partial<Router> {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    currentRoute: {
      value: {
        path: '/',
        fullPath: '/',
        params: {},
        query: {},
        hash: '',
        name: undefined,
        matched: [],
        redirectedFrom: undefined,
        meta: {},
      },
    } as any,
  }
}

/**
 * Create mock API response
 */
export function createMockApiResponse<T>(data: T, error: any = null) {
  return {
    data: { value: error ? null : data },
    error: { value: error },
    status: { value: error ? 'error' : 'success' },
  }
}

/**
 * Mock user data
 */
export const mockUser = {
  id: '123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  roles: ['CUSTOMER' as const],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

/**
 * Mock admin user
 */
export const mockAdminUser = {
  ...mockUser,
  email: 'admin@example.com',
  roles: ['ADMIN' as const],
}

/**
 * Mock auth response
 */
export const mockAuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}

/**
 * Mock admin auth response
 */
export const mockAdminAuthResponse = {
  user: mockAdminUser,
  accessToken: 'mock-admin-access-token',
  refreshToken: 'mock-admin-refresh-token',
}
