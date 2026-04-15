<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    title: string
    body: string
    iconFill?: boolean
  }>(),
  { iconFill: false }
)
</script>

<template>
  <div class="empty-state" role="status">
    <span
      class="empty-state__icon material-symbols-outlined"
      :style="iconFill ? `font-variation-settings: 'FILL' 1` : undefined"
      aria-hidden="true"
      >{{ icon }}</span
    >
    <h2 class="empty-state__title">{{ title }}</h2>
    <p class="empty-state__body">{{ body }}</p>
    <div v-if="$slots.cta" class="empty-state__cta">
      <slot name="cta" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
  text-align: center;
  gap: 0.75rem;
}

.empty-state__icon {
  font-size: 4.5rem;
  color: var(--color-secondary);
  opacity: 0.2;
}

.empty-state__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.empty-state__body {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-secondary);
  margin: 0;
}

.empty-state__cta {
  margin-top: 0.5rem;
}
</style>
