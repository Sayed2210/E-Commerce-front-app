import type { Currency, CreateCurrencyDto, UpdateCurrencyDto } from '~/types/api'

export function useCurrencies() {
  const { apiCall } = useApiClient()
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  async function listCurrencies() {
    return apiCall<Currency[]>('/currencies', { method: 'GET' })
  }

  async function createCurrency(dto: CreateCurrencyDto) {
    const { error } = await apiCall<Currency>('/currencies', {
      method: 'POST',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.currenciesPage.created'))
    return true
  }

  async function updateCurrency(code: string, dto: UpdateCurrencyDto) {
    const { error } = await apiCall<Currency>(`/currencies/${code}`, {
      method: 'PATCH',
      body: dto,
    })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.currenciesPage.updated'))
    return true
  }

  async function deleteCurrency(code: string) {
    const { error } = await apiCall(`/currencies/${code}`, { method: 'DELETE' })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.currenciesPage.deleted'))
    return true
  }

  async function setDefaultCurrency(code: string) {
    const { error } = await apiCall(`/currencies/${code}/default`, { method: 'PATCH' })
    if (error) {
      showError(error)
      return false
    }
    showSuccess(t('admin.currenciesPage.setDefault'))
    return true
  }

  return {
    listCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    setDefaultCurrency,
  }
}
