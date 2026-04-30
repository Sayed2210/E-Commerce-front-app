export function useInvoices() {
  const { apiCall } = useApiClient()
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  async function downloadInvoice(orderId: string) {
    try {
      const config = useRuntimeConfig()
      const baseURL = config.public.apiBaseUrl as string
      const { getAccessToken } = await import('~/utils/token')
      const token = getAccessToken()

      const response = await $fetch.raw(`${baseURL}/orders/${orderId}/invoice`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      const blob = response._data
        ? new Blob([response._data as BlobPart], { type: 'application/pdf' })
        : null

      if (!blob) {
        showError(null, t('invoice.downloadFailed'))
        return false
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${orderId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return true
    } catch (err) {
      showError(err, t('invoice.downloadFailed'))
      return false
    }
  }

  async function resendInvoice(orderId: string) {
    const { error } = await apiCall(`/admin/orders/${orderId}/resend-invoice`, {
      method: 'POST',
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('invoice.resendSuccess'))
    return true
  }

  return {
    downloadInvoice,
    resendInvoice,
  }
}
