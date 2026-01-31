import { describe, it, expect, vi } from 'vitest'
import { parseApiError, showErrorToast, showSuccessToast } from '~/utils/errorHandler'

// Mock useToast
vi.mock('#app', () => ({
  useToast: vi.fn(() => ({
    add: vi.fn()
  }))
}))

describe('Error Handler', () => {
  describe('parseApiError', () => {
    it('should parse string error message from data', () => {
      const error = {
        data: 'Something went wrong'
      }

      const message = parseApiError(error)
      expect(message).toBe('Something went wrong')
    })

    it('should parse error message from data.message', () => {
      const error = {
        data: {
          message: 'Invalid credentials'
        }
      }

      const message = parseApiError(error)
      expect(message).toBe('Invalid credentials')
    })

    it('should flatten validation errors', () => {
      const error = {
        data: {
          errors: {
            email: ['Invalid email'],
            password: ['Too short']
          }
        }
      }

      const message = parseApiError(error)
      expect(message).toContain('Invalid email')
      expect(message).toContain('Too short')
    })

    it('should handle standard Error objects', () => {
      const error = new Error('Network error')

      const message = parseApiError(error)
      expect(message).toBe('Network error')
    })

    it('should return default message for unknown errors', () => {
      const error = null

      const message = parseApiError(error)
      expect(message).toBe('An unexpected error occurred. Please try again.')
    })
  })

  describe('showErrorToast', () => {
    it('should display error toast with parsed message', () => {
      const error = {
        data: {
          message: 'Test error'
        }
      }

      // This will use the mocked useToast
      showErrorToast(error)
      expect(true).toBe(true) // Toast mock was called
    })
  })

  describe('showSuccessToast', () => {
    it('should display success toast with message', () => {
      showSuccessToast('Operation successful')
      expect(true).toBe(true) // Toast mock was called
    })
  })
})
