import { getAccessToken } from '~/utils/token'

function authH(): Record<string, string> {
  const t = getAccessToken()
  const h: Record<string, string> = {}
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function useProductImages() {
  const { t } = useI18n()
  const { showError, showSuccess } = useToasts()
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
      showSuccess(t('admin.productsPage.uploadImages'))
      return { data, error: null }
    } catch (err) {
      showError(err)
      return { data: null, error: err }
    }
  }

  async function deleteImage(productId: string, imageId: string) {
    try {
      await $fetch(`${baseURL}/products/${productId}/images/${imageId}`, {
        method: 'DELETE',
        headers: authH(),
      })
      showSuccess(t('admin.productsPage.remove'))
      return { error: null }
    } catch (err) {
      showError(err)
      return { error: err }
    }
  }

  async function setPrimary(productId: string, imageId: string) {
    try {
      await $fetch(`${baseURL}/products/${productId}/images/${imageId}/primary`, {
        method: 'PATCH',
        headers: authH(),
      })
      showSuccess(t('admin.productsPage.primary'))
      return { error: null }
    } catch (err) {
      showError(err)
      return { error: err }
    }
  }

  return { uploadImage, deleteImage, setPrimary }
}
