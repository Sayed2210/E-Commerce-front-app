/**
 * Centralized status color management
 * Single source of truth for status styling across admin pages
 */

export interface StatusColorConfig {
  bg: string // Background color class
  text: string // Text color class
  icon?: string // Icon color
}

// Status color map - single source of truth
const STATUS_COLORS: Record<string, StatusColorConfig> = {
  // Order statuses
  pending: {
    bg: 'bg-surface-container',
    text: 'text-secondary',
  },
  confirmed: {
    bg: 'bg-secondary-container',
    text: 'text-on-surface',
  },
  processing: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
  },
  shipped: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  delivered: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
  },
  cancelled: {
    bg: 'bg-error-container',
    text: 'text-on-error-container',
  },
  refunded: {
    bg: 'bg-surface-container',
    text: 'text-secondary',
  },

  // Product statuses
  active: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
  },
  inactive: {
    bg: 'bg-surface-container',
    text: 'text-secondary',
  },
}

export function useStatusColors() {
  /**
   * Get status color config
   */
  function getStatusConfig(status: string): StatusColorConfig {
    return (
      STATUS_COLORS[status.toLowerCase()] || {
        bg: 'bg-surface-container',
        text: 'text-secondary',
      }
    )
  }

  /**
   * Get combined class string for a status
   */
  function getStatusClass(status: string): string {
    const config = getStatusConfig(status)
    return `${config.bg} ${config.text}`
  }

  /**
   * Get background color only
   */
  function getStatusBg(status: string): string {
    return getStatusConfig(status).bg
  }

  /**
   * Get text color only
   */
  function getStatusText(status: string): string {
    return getStatusConfig(status).text
  }

  return {
    getStatusConfig,
    getStatusClass,
    getStatusBg,
    getStatusText,
    STATUS_COLORS,
  }
}
