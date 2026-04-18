import { describe, it, expect } from 'vitest'
import { useStatusColors } from '~/composables/admin/useStatusColors'

describe('useStatusColors', () => {
  const { getStatusConfig, getStatusClass, getStatusBg, getStatusText, STATUS_COLORS } =
    useStatusColors()

  describe('getStatusConfig', () => {
    it('returns config for known status', () => {
      const config = getStatusConfig('pending')
      expect(config.bg).toBe('bg-surface-container')
      expect(config.text).toBe('text-secondary')
    })

    it('returns config for delivered', () => {
      const config = getStatusConfig('delivered')
      expect(config.bg).toBe('bg-emerald-100')
      expect(config.text).toBe('text-emerald-800')
    })

    it('returns default config for unknown status', () => {
      const config = getStatusConfig('unknown-status')
      expect(config.bg).toBe('bg-surface-container')
      expect(config.text).toBe('text-secondary')
    })

    it('is case-insensitive', () => {
      const config = getStatusConfig('PENDING')
      expect(config.bg).toBe('bg-surface-container')
    })
  })

  describe('getStatusClass', () => {
    it('returns combined bg and text classes', () => {
      const cls = getStatusClass('cancelled')
      expect(cls).toContain('bg-error-container')
      expect(cls).toContain('text-on-error-container')
    })

    it('returns default class for unknown status', () => {
      const cls = getStatusClass('xyz')
      expect(cls).toContain('bg-surface-container')
      expect(cls).toContain('text-secondary')
    })
  })

  describe('getStatusBg', () => {
    it('returns background class only', () => {
      expect(getStatusBg('active')).toBe('bg-emerald-100')
    })
  })

  describe('getStatusText', () => {
    it('returns text class only', () => {
      expect(getStatusText('active')).toBe('text-emerald-800')
    })
  })

  describe('STATUS_COLORS', () => {
    it('exports the full status color map', () => {
      expect(STATUS_COLORS).toHaveProperty('pending')
      expect(STATUS_COLORS).toHaveProperty('delivered')
      expect(STATUS_COLORS).toHaveProperty('cancelled')
      expect(STATUS_COLORS).toHaveProperty('active')
      expect(STATUS_COLORS).toHaveProperty('inactive')
    })

    it('covers all order lifecycle statuses', () => {
      const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
      for (const status of orderStatuses) {
        expect(STATUS_COLORS).toHaveProperty(status)
      }
    })
  })
})
