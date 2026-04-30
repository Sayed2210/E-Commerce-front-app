import type {
  PointRedemption,
  CreatePointRedemptionDto,
  UpdatePointRedemptionDto,
} from '~/types/api'

export function usePointRedemptions() {
  const { apiCall } = useApiClient()
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  async function listPointRedemptions() {
    return apiCall<PointRedemption[]>('/admin/point-redemptions', { method: 'GET' })
  }

  async function createPointRedemption(dto: CreatePointRedemptionDto) {
    const { error } = await apiCall<PointRedemption>('/admin/point-redemptions', {
      method: 'POST',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.loyalty.redemptionCreated'))
    return true
  }

  async function updatePointRedemption(id: string, dto: UpdatePointRedemptionDto) {
    const { error } = await apiCall<PointRedemption>(`/admin/point-redemptions/${id}`, {
      method: 'PATCH',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.loyalty.redemptionUpdated'))
    return true
  }

  async function deletePointRedemption(id: string) {
    const { error } = await apiCall(`/admin/point-redemptions/${id}`, { method: 'DELETE' })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.loyalty.redemptionDeleted'))
    return true
  }

  return {
    listPointRedemptions,
    createPointRedemption,
    updatePointRedemption,
    deletePointRedemption,
  }
}
