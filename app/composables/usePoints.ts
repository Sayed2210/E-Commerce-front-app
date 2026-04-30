import type { PointTransaction, RedeemPointsDto, RedeemPointsPreview } from '~/types/api'

export function usePoints() {
  const { apiCall } = useApiClient()
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  async function getBalance() {
    return apiCall<{ balance: number }>('/points/balance', { method: 'GET' })
  }

  async function getHistory() {
    return apiCall<PointTransaction[]>('/points/history', { method: 'GET' })
  }

  async function redeemPreview(dto: RedeemPointsDto) {
    return apiCall<RedeemPointsPreview>('/points/redeem-preview', {
      method: 'POST',
      body: dto,
    })
  }

  async function redeem(dto: RedeemPointsDto) {
    const { data, error } = await apiCall<RedeemPointsPreview>('/points/redeem', {
      method: 'POST',
      body: dto,
    })
    if (error) {
      showError(error)
      return { data: null, error }
    }
    showSuccess(t('points.redeemed'))
    return { data, error: null }
  }

  return {
    getBalance,
    getHistory,
    redeemPreview,
    redeem,
  }
}
