import type { Coupon, CreateCouponDto } from '~/types/api'
import { showSuccessToast, showErrorToast } from '~/utils/errorHandler'
import { getAccessToken } from '~/utils/token'

export function useCoupons() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function authH() {
    const t = getAccessToken()
    return t ? { Authorization: `Bearer ${t}` } : {}
  }

  async function handleCreate(form: CreateCouponDto, refresh: () => Promise<void>) {
    try {
      await $fetch(`${baseURL}/coupons`, {
        method: 'POST',
        body: { ...form },
        headers: authH(),
      })
      showSuccessToast('Coupon created.')
      const initialForm = {
        code: '',
        type: 'percentage',
        value: 0,
        minOrderValue: 0,
        startDate: new Date().toISOString().slice(0, 10),
        isActive: true,
      }
      Object.assign(form, initialForm)
      await refresh()
    } catch (err) {
      showErrorToast(err)
    }
  }

  async function toggleActive(coupon: Coupon, processingId: Ref<string | null>, refresh: () => Promise<void>) {
    processingId.value = coupon.id
    try {
      await $fetch(`${baseURL}/coupons/${coupon.id}`, {
        method: 'PATCH',
        body: { isActive: !coupon.isActive },
        headers: authH(),
      })
      showSuccessToast(coupon.isActive ? 'Coupon deactivated.' : 'Coupon activated.')
      await refresh()
    } catch (err) {
      showErrorToast(err)
    } finally {
      processingId.value = null
    }
  }

  async function deleteCoupon(id: string, processingId: Ref<string | null>, refresh: () => Promise<void>) {
    processingId.value = id
    try {
      await $fetch(`${baseURL}/coupons/${id}`, { method: 'DELETE', headers: authH() })
      showSuccessToast('Coupon deleted.')
      await refresh()
    } catch (err) {
      showErrorToast(err)
    } finally {
      processingId.value = null
    }
  }

  function formatValue(c: Coupon) {
    return c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `$${c.value}` : 'Free shipping'
  }

  return { handleCreate, toggleActive, deleteCoupon, formatValue }
}
