import type { PointRule, CreatePointRuleDto, UpdatePointRuleDto } from '~/types/api'

export function usePointRules() {
  const { apiCall } = useApiClient()
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  async function listPointRules() {
    return apiCall<PointRule[]>('/admin/point-rules', { method: 'GET' })
  }

  async function createPointRule(dto: CreatePointRuleDto) {
    const { error } = await apiCall<PointRule>('/admin/point-rules', {
      method: 'POST',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.loyalty.ruleCreated'))
    return true
  }

  async function updatePointRule(id: string, dto: UpdatePointRuleDto) {
    const { error } = await apiCall<PointRule>(`/admin/point-rules/${id}`, {
      method: 'PATCH',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.loyalty.ruleUpdated'))
    return true
  }

  async function deletePointRule(id: string) {
    const { error } = await apiCall(`/admin/point-rules/${id}`, { method: 'DELETE' })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.loyalty.ruleDeleted'))
    return true
  }

  return {
    listPointRules,
    createPointRule,
    updatePointRule,
    deletePointRule,
  }
}
