export function useNewsletter() {
  const email = ref('')
  const sent = ref(false)

  function submit() {
    if (email.value.trim()) {
      sent.value = true
      // TODO: POST to /newsletter/subscribe when endpoint is available
    }
  }

  return { email, sent, submit }
}
