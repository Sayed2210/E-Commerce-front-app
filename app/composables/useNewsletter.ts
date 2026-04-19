export function useNewsletter() {
  const config = useRuntimeConfig()
  const email = ref('')
  const name = ref('')
  const sent = ref(false)
  const loading = ref(false)

  async function submit() {
    if (!email.value.trim()) return
    loading.value = true
    try {
      await $fetch('/newsletter/subscribe', {
        method: 'POST',
        body: { email: email.value, name: name.value || undefined },
        baseURL: config.public.apiBaseUrl as string,
      })
      sent.value = true
    } finally {
      loading.value = false
    }
  }

  return { email, name, sent, loading, submit }
}
