import type { ShippingRate, CreateShippingRateDto, UpdateShippingRateDto } from '~/types/api'

export function useShippingRates() {
  const { apiCall } = useApiClient()
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  async function listShippingRates() {
    return apiCall<ShippingRate[]>('/shipping/rates', { method: 'GET' })
  }

  async function createShippingRate(dto: CreateShippingRateDto) {
    const { error } = await apiCall<ShippingRate>('/shipping/rates', {
      method: 'POST',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.shipping.rateCreated'))
    return true
  }

  async function updateShippingRate(id: string, dto: UpdateShippingRateDto) {
    const { error } = await apiCall<ShippingRate>(`/shipping/rates/${id}`, {
      method: 'PATCH',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.shipping.rateUpdated'))
    return true
  }

  async function deleteShippingRate(id: string) {
    const { error } = await apiCall(`/shipping/rates/${id}`, { method: 'DELETE' })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.shipping.rateDeleted'))
    return true
  }

  return {
    listShippingRates,
    createShippingRate,
    updateShippingRate,
    deleteShippingRate,
  }
}
