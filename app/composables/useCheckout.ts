import { getAccessToken } from '~/utils/token'
import type {
  Order,
  ApplyCouponResponse,
  CreateOrderDto,
  ValidateCheckoutDto,
  ValidateCheckoutResponse,
} from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export function useCheckout() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  async function applyCoupon(code: string) {
    try {
      const data = await $fetch<ApplyCouponResponse>(`${baseURL}/checkout/apply-coupon`, {
        method: 'POST',
        body: { code },
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function validateCheckout(dto: ValidateCheckoutDto) {
    try {
      const data = await $fetch<ValidateCheckoutResponse>(`${baseURL}/checkout/validate`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function createOrder(dto: CreateOrderDto) {
    try {
      const data = await $fetch<{ order: Order; paymentIntentId?: string }>(
        `${baseURL}/checkout/create-order`,
        { method: 'POST', body: dto, headers: authH() }
      )
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  return { applyCoupon, validateCheckout, createOrder }
}
