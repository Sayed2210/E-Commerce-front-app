import type { ShippingZone, CreateShippingZoneDto, UpdateShippingZoneDto } from '~/types/api'

export function useShippingZones() {
  const { apiCall } = useApiClient()
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  async function listShippingZones() {
    return apiCall<ShippingZone[]>('/shipping/zones', { method: 'GET' })
  }

  async function createShippingZone(dto: CreateShippingZoneDto) {
    const { error } = await apiCall<ShippingZone>('/shipping/zones', {
      method: 'POST',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.shipping.zoneCreated'))
    return true
  }

  async function updateShippingZone(id: string, dto: UpdateShippingZoneDto) {
    const { error } = await apiCall<ShippingZone>(`/shipping/zones/${id}`, {
      method: 'PATCH',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.shipping.zoneUpdated'))
    return true
  }

  async function deleteShippingZone(id: string) {
    const { error } = await apiCall(`/shipping/zones/${id}`, { method: 'DELETE' })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.shipping.zoneDeleted'))
    return true
  }

  return {
    listShippingZones,
    createShippingZone,
    updateShippingZone,
    deleteShippingZone,
  }
}
