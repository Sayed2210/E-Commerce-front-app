import type { ShippingCalculation } from '~/types/api'

export function useShipping() {
  const { apiCall } = useApiClient()

  async function calculateShipping(addressId: string, weight: number, orderValue: number) {
    return apiCall<ShippingCalculation>(
      `/shipping/calculate?addressId=${addressId}&weight=${weight}&orderValue=${orderValue}`,
      { method: 'GET' }
    )
  }

  return {
    calculateShipping,
  }
}
