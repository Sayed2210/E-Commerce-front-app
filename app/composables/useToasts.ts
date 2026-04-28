import { parseApiError } from '~/utils/errorHandler'

export function useToasts() {
  const { t } = useI18n()
  const toast = useToast()

  function showError(error: unknown, fallbackMessage?: string) {
    const message = parseApiError(error) || fallbackMessage || t('error.unexpected')
    toast.add({
      title: t('toast.errorTitle'),
      description: message,
      color: 'error' as const,
      duration: 5000,
    })
  }

  function showSuccess(message: string) {
    toast.add({
      title: t('toast.successTitle'),
      description: message,
      color: 'success' as const,
      duration: 3000,
    })
  }

  return { showError, showSuccess }
}
