<script setup lang="ts">
interface StripeCardElement {
  mount(selector: string | HTMLElement): void
  destroy(): void
  on(event: string, handler: (e: unknown) => void): void
}
interface StripeElements {
  create(type: 'card', options?: object): StripeCardElement
}
interface StripeInstance {
  elements(): StripeElements
  confirmCardPayment(
    clientSecret: string,
    data: { payment_method: { card: StripeCardElement } }
  ): Promise<{ error?: { message: string }; paymentIntent?: { status: string } }>
}

const props = defineProps<{ publishableKey: string }>()

const cardMountRef = useTemplateRef<HTMLElement>('cardMount')
const stripe = ref<StripeInstance | null>(null)
const card = ref<StripeCardElement | null>(null)
const cardError = ref('')
const ready = ref(false)

onMounted(async () => {
  if (!(window as Window & { Stripe?: (k: string) => StripeInstance }).Stripe) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://js.stripe.com/v3/'
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Failed to load Stripe.js'))
      document.head.appendChild(s)
    })
  }
  stripe.value = (window as Window & { Stripe: (k: string) => StripeInstance }).Stripe(
    props.publishableKey
  )
  const elements = stripe.value.elements()
  card.value = elements.create('card', {
    style: {
      base: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        color: '#1a1a1a',
        '::placeholder': { color: '#9ca3af' },
      },
    },
  })
  if (cardMountRef.value) {
    card.value.mount(cardMountRef.value)
    card.value.on('change', (e: unknown) => {
      const ev = e as { error?: { message: string } }
      cardError.value = ev.error?.message ?? ''
    })
  }
  ready.value = true
})

onBeforeUnmount(() => {
  card.value?.destroy()
})

async function confirmCard(clientSecret: string) {
  if (!stripe.value || !card.value) throw new Error('Stripe not ready')
  const result = await stripe.value.confirmCardPayment(clientSecret, {
    payment_method: { card: card.value },
  })
  if (result.error) throw new Error(result.error.message)
  return result.paymentIntent
}

defineExpose({ confirmCard, ready })
</script>

<template>
  <div class="stripe-element">
    <label class="stripe-element__label">Card Details</label>
    <div v-if="!ready" class="stripe-element__skeleton" aria-busy="true" />
    <div
      ref="cardMount"
      class="stripe-element__mount"
      :class="{ 'stripe-element__mount--hidden': !ready }"
    />
    <p v-if="cardError" class="stripe-element__error" role="alert">{{ cardError }}</p>
  </div>
</template>

<style scoped>
.stripe-element {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stripe-element__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.stripe-element__skeleton {
  height: 2.5rem;
  background: var(--color-surface-container);
  border-radius: var(--radius-sm);
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

.stripe-element__mount {
  background: var(--color-surface-container);
  border-radius: var(--radius-sm);
  padding: 0.75rem 0.875rem;
  transition: box-shadow var(--transition-fast);
}

.stripe-element__mount--hidden {
  display: none;
}

.stripe-element__mount:focus-within {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

.stripe-element__error {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-error);
  margin: 0;
}

@keyframes skeleton-shimmer {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}
</style>
