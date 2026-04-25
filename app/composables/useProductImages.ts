import { showSuccessToast, showErrorToast } from '~/utils/errorHandler'
import { getAccessToken } from '~/utils/token'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useProductImages() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  async function uploadImage(productId: string, file: File) {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const data = await $fetch<string[]>(`${baseURL}/products/${productId}/images`, {
        method: 'POST',
        body: formData,
        headers: authH(),
      })
      showSuccessToast('Image uploaded.')
      return { data, error: null }
    } catch (err) {
      showErrorToast(err)
      return { data: null, error: err }
    }
  }

  async function deleteImage(productId: string, imageId: string) {
    try {
      await $fetch(`${baseURL}/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        headers: authH(),
      })
      showSuccessToast('Image deleted.')
      return { error: null }
    } catch (err) {
      showErrorToast(err)
      return { error: err }
    }
  }

  async function setPrimary(productId: string, imageId: string) {
    try {
      await $fetch(`${baseURL}/products/${productId}/images/${imageId}/primary`, {
        method: 'PATCH',
        headers: authH(),
      })
      showSuccessToast('Primary image set.')
      return { error: null }
    } catch (err) {
      showErrorToast(err)
      return { error: err }
    }
  }

  return { uploadImage, deleteImage, setPrimary }
}
