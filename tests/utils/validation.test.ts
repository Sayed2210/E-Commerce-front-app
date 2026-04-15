import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '~/utils/validation'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const emailError = result.error.issues.find((issue) => issue.path.includes('email'))
        expect(emailError).toBeDefined()
      }
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) => issue.path.includes('password'))
        expect(passwordError).toBeDefined()
      }
    })

    it('should require both email and password', () => {
      const invalidData = {
        email: 'test@example.com',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'different',
        firstName: 'John',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) =>
          issue.message.includes("don't match")
        )
        expect(passwordError).toBeDefined()
      }
    })

    it('should reject invalid email in registration', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
        passwordConfirmation: 'password123',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should allow optional firstName and lastName', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
