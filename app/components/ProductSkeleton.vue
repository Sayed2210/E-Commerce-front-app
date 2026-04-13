<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'grid' | 'list'
  }>(),
  { variant: 'grid' }
)
</script>

<template>
  <!-- aria-hidden so screen readers skip loading placeholders -->
  <div class="skeleton" :class="`skeleton--${variant}`" aria-hidden="true" role="presentation">
    <div class="skeleton__image" />
    <div class="skeleton__body">
      <div class="skeleton__line skeleton__line--short" />
      <div class="skeleton__line skeleton__line--medium" />
      <div class="skeleton__line skeleton__line--price" />
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton--grid {
  display: flex;
  flex-direction: column;
}

.skeleton--list {
  display: flex;
  flex-direction: row;
  gap: 1.25rem;
  padding: 1rem;
}

/* Image placeholder */
.skeleton__image {
  background: var(--color-surface-container-low);
  animation: shimmer 1.6s ease-in-out infinite;
}

.skeleton--grid .skeleton__image {
  aspect-ratio: 1;
  width: 100%;
  border-radius: var(--radius-DEFAULT);
}

.skeleton--list .skeleton__image {
  width: 7rem;
  height: 7rem;
  flex-shrink: 0;
  border-radius: var(--radius-DEFAULT);
}

/* Body */
.skeleton__body {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.skeleton--list .skeleton__body {
  padding: 0;
  justify-content: center;
}

/* Lines */
.skeleton__line {
  background: var(--color-surface-container-low);
  border-radius: var(--radius-sm);
  height: 0.75rem;
  animation: shimmer 1.6s ease-in-out infinite;
}

.skeleton__line--short {
  width: 40%;
}

.skeleton__line--medium {
  width: 70%;
}

.skeleton__line--price {
  width: 30%;
  height: 1rem;
}

/* Stagger delay so lines don't pulse in sync */
.skeleton__line:nth-child(2) {
  animation-delay: 0.1s;
}

.skeleton__line:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}
</style>
