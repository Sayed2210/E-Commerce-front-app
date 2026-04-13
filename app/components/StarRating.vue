<script setup lang="ts">
const props = defineProps<{
  /** 0–5, fractional values are rounded to nearest whole star */
  rating: number
  /** Review count shown after stars */
  count?: number
  /** Accessible label prefix — e.g. "Product rating" */
  label?: string
}>()

const filled = computed(() => Math.round(props.rating ?? 0))

const ariaLabel = computed(() => {
  const base = props.label ? `${props.label}: ` : ''
  const score = `${props.rating.toFixed(1)} out of 5 stars`
  const reviews = props.count !== undefined ? `, ${props.count} reviews` : ''
  return `${base}${score}${reviews}`
})
</script>

<template>
  <div class="stars" :aria-label="ariaLabel" role="img">
    <span
      v-for="s in 5"
      :key="s"
      class="stars__icon material-symbols-outlined"
      :class="s <= filled ? 'stars__icon--filled' : 'stars__icon--empty'"
      :style="s <= filled ? `font-variation-settings: 'FILL' 1` : undefined"
      aria-hidden="true"
      >star</span
    >
    <span v-if="count !== undefined" class="stars__count" aria-hidden="true">{{ count }}</span>
  </div>
</template>

<style scoped>
.stars {
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

.stars__icon {
  font-size: 0.75rem;
  line-height: 1;
}

.stars__icon--filled {
  color: var(--color-primary-container);
}

.stars__icon--empty {
  color: var(--color-outline-variant);
}

.stars__count {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-left: 0.25rem;
}
</style>
