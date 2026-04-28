/**
 * Parse API error response
 */
export function parseApiError(error: unknown): string | undefined {
  // Type guard: check if error is an object
  if (typeof error === 'object' && error !== null) {
    // Handle Nuxt/Fetch errors with data property
    if ('data' in error) {
      const data = error.data
      if (typeof data === 'string') {
        return data
      }
      if (typeof data === 'object' && data !== null) {
        if ('message' in data && typeof data.message === 'string') {
          return data.message
        }
        if ('errors' in data && typeof data.errors === 'object' && data.errors !== null) {
          // Flatten validation errors
          const errors = Object.values(data.errors as Record<string, string[]>).flat()
          return errors.join(', ')
        }
      }
    }

    // Handle standard Error objects
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
  }

  return undefined
}

/**
 * Display error toast notification
 * @deprecated Use useToasts() composable for translated toasts
 */
export function showErrorToast(error: unknown) {
  const toast = useToast()
  const message = parseApiError(error) || 'An unexpected error occurred. Please try again.'

  toast.add({
    title: 'Error',
    description: message,
    color: 'error' as const,
    duration: 5000,
  })
}

/**
 * Display success toast notification
 * @deprecated Use useToasts() composable for translated toasts
 */
export function showSuccessToast(message: string) {
  const toast = useToast()

  toast.add({
    title: 'Success',
    description: message,
    color: 'success' as const,
    duration: 3000,
  })
}
