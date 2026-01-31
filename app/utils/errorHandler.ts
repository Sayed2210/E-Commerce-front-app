interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}

/**
 * Parse API error response
 */
export function parseApiError(error: any): string {
  // Handle Nuxt/Fetch errors
  if (error?.data) {
    if (typeof error.data === 'string') {
      return error.data
    }
    if (error.data.message) {
      return error.data.message
    }
    if (error.data.errors) {
      // Flatten validation errors
      const errors = Object.values(error.data.errors).flat()
      return errors.join(', ')
    }
  }

  // Handle standard Error objects
  if (error?.message) {
    return error.message
  }

  // Default error message
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Display error toast notification
 */
export function showErrorToast(error: any) {
  const toast = useToast()
  const message = parseApiError(error)
  
  toast.add({
    title: 'Error',
    description: message,
    color: 'red',
    timeout: 5000
  })
}

/**
 * Display success toast notification
 */
export function showSuccessToast(message: string) {
  const toast = useToast()
  
  toast.add({
    title: 'Success',
    description: message,
    color: 'green',
    timeout: 3000
  })
}
