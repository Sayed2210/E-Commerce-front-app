import type { NewsletterStats, SendCampaignDto } from '~/types/api'
import { showSuccessToast, showErrorToast } from '~/utils/errorHandler'
import { getAccessToken } from '~/utils/token'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useNewsletterAdmin() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function getStats() {
    return useFetch<NewsletterStats>('/newsletter/stats', { baseURL, headers: authH() })
  }

  async function sendCampaign(form: SendCampaignDto) {
    try {
      const data = await $fetch(`${baseURL}/newsletter/send`, {
        method: 'POST',
        body: form,
        headers: authH(),
      })
      showSuccessToast('Campaign sent.')
      return { data, error: null }
    } catch (err) {
      showErrorToast(err)
      return { data: null, error: err }
    }
  }

  async function unsubscribe(email: string) {
    try {
      const data = await $fetch(`${baseURL}/newsletter/unsubscribe`, {
        method: 'POST',
        body: { email },
        headers: authH(),
      })
      showSuccessToast('Unsubscribed.')
      return { data, error: null }
    } catch (err) {
      showErrorToast(err)
      return { data: null, error: err }
    }
  }

  return { getStats, sendCampaign, unsubscribe }
}
