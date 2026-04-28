import type { Coupon, CreateCouponDto } from '~/types/api'
import { getAccessToken } from '~/utils/token'

export function useCoupons() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()

  function authH(): Record<string, string> {
    const token = getAccessToken()
    const h: Record<string, string> = {}
    if (token) h['Authorization'] = `Bearer ${token}`
    return h
  }

  async function handleCreate(form: CreateCouponDto, refresh: () => Promise<void>) {
    try {
      await $fetch(`${baseURL}/coupons`, {
        method: 'POST',
        body: { ...form },
        headers: authH(),
      })
      showSuccess(t('toast.couponCreated'))
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
      showError(err)
    }
  }

  async function toggleActive(
    coupon: Coupon,
    processingId: Ref<string | null>,
    refresh: () => Promise<void>
  ) {
    processingId.value = coupon.id
    try {
      await $fetch(`${baseURL}/coupons/${coupon.id}`, {
        method: 'PATCH',
        body: { isActive: !coupon.isActive },
        headers: authH(),
      })
      showSuccess(coupon.isActive ? t('toast.couponDeactivated') : t('toast.couponActivated'))
      await refresh()
    } catch (err) {
      showError(err)
    } finally {
      processingId.value = null
    }
  }

  async function deleteCoupon(
    id: string,
    processingId: Ref<string | null>,
    refresh: () => Promise<void>
  ) {
    processingId.value = id
    try {
      await $fetch(`${baseURL}/coupons/${id}`, { method: 'DELETE', headers: authH() })
      showSuccess(t('toast.couponDeleted'))
      await refresh()
    } catch (err) {
      showError(err)
    } finally {
      processingId.value = null
    }
  }

  function formatValue(c: Coupon) {
    return c.type === 'percentage'
      ? `${c.value}%`
      : c.type === 'fixed'
        ? `$${c.value}`
        : 'Free shipping'
  }

  return { handleCreate, toggleActive, deleteCoupon, formatValue }
}
