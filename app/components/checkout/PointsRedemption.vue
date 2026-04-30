<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { usePoints } from '~/composables/usePoints'
import type { RedeemPointsDto } from '~/types/api'

const emit = defineEmits<{
  'update:redeem': [dto: RedeemPointsDto | null]
}>()

const { getBalance, redeemPreview } = usePoints()

const { data: balanceData } = await getBalance()
const userBalance = computed(() => balanceData.value?.balance ?? 0)

const selectedType = ref<'discount' | 'free_shipping' | 'free_order'>('discount')
const sliderValue = ref(0)
const preview = ref<{ discountValue: number; newTotal: number } | null>(null)
const previewLoading = ref(false)

const canRedeem = computed(() => userBalance.value > 0)

async function fetchPreview() {
  if (sliderValue.value <= 0) {
    preview.value = null
    emit('update:redeem', null)
    return
  }
  previewLoading.value = true
  const { data } = await redeemPreview({
    points: sliderValue.value,
    redemptionType: selectedType.value,
  })
  preview.value = data
  previewLoading.value = false
  if (data) {
    emit('update:redeem', { points: sliderValue.value, redemptionType: selectedType.value })
  }
}

const debouncedPreview = useDebounceFn(fetchPreview, 300)

watch([sliderValue, selectedType], () => {
  debouncedPreview()
})

const maxSlider = computed(() => userBalance.value)
</script>

<template>
  <div class="points-redemption">
    <h2 class="points-redemption__title">
      <span class="material-symbols-outlined" aria-hidden="true">stars</span>
      {{ $t('checkout.loyaltyPoints') }}
    </h2>

    <div v-if="!canRedeem" class="points-redemption__empty">
      {{ $t('checkout.noPointsBalance') }}
    </div>

    <template v-else>
      <div class="points-redemption__balance">
        {{ $t('checkout.pointsBalance', { balance: userBalance }) }}
      </div>

      <div class="points-redemption__type">
        <label class="points-redemption__label">{{ $t('checkout.redemptionType') }}</label>
        <select v-model="selectedType" class="points-redemption__select">
          <option value="discount">{{ $t('checkout.discount') }}</option>
          <option value="free_shipping">{{ $t('checkout.freeShipping') }}</option>
          <option value="free_order">{{ $t('checkout.freeOrder') }}</option>
        </select>
      </div>

      <div class="points-redemption__slider-wrap">
        <label class="points-redemption__label">
          {{ $t('checkout.pointsToRedeem', { points: sliderValue }) }}
        </label>
        <input
          v-model.number="sliderValue"
          type="range"
          min="0"
          :max="maxSlider"
          step="10"
          class="points-redemption__slider"
        />
        <div class="points-redemption__slider-labels">
          <span>0</span>
          <span>{{ maxSlider }}</span>
        </div>
      </div>

      <div v-if="previewLoading" class="points-redemption__loading">
        {{ $t('common.loading') }}
      </div>

      <div v-else-if="preview" class="points-redemption__preview">
        <div class="points-redemption__preview-row">
          <span>{{ $t('checkout.discountValue') }}</span>
          <span class="points-redemption__preview-val">{{ format(preview.discountValue) }}</span>
        </div>
        <div class="points-redemption__preview-row points-redemption__preview-row--total">
          <span>{{ $t('checkout.newTotal') }}</span>
          <span class="points-redemption__preview-val">{{ format(preview.newTotal) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.points-redemption {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.points-redemption__title {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.points-redemption__title .material-symbols-outlined {
  color: var(--color-primary);
}

.points-redemption__empty {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.points-redemption__balance {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
}

.points-redemption__type {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.points-redemption__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
}

.points-redemption__select {
  background: var(--color-surface-container);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  cursor: pointer;
}

.points-redemption__slider-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.points-redemption__slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-surface-container);
  border-radius: var(--radius-full);
  outline: none;
}

.points-redemption__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.points-redemption__slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.points-redemption__slider-labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-label);
  font-size: 0.75rem;
  color: var(--color-secondary);
}

.points-redemption__loading {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.points-redemption__preview {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-top: 0.75rem;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.points-redemption__preview-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.points-redemption__preview-row--total {
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.points-redemption__preview-val {
  font-weight: 600;
  color: var(--color-on-surface);
}

.points-redemption__preview-row--total .points-redemption__preview-val {
  color: var(--color-primary);
}
</style>
