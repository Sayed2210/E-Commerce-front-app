<script setup lang="ts">
// Static presentational component — no logic required
</script>

<template>
  <section class="hero" aria-label="Hero banner">
    <div class="hero__bg" aria-hidden="true" />

    <div class="hero__content">
      <span class="hero__eyebrow">Seasonal Event</span>
      <h1 class="hero__title">Curated for<br />the Discerning</h1>
      <p class="hero__body">
        Precision-engineered essentials for the modern lifestyle. Save up to 40% on select items
        this season.
      </p>
      <div class="hero__ctas">
        <NuxtLink to="/products" class="hero__btn-primary">
          Shop Now
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </NuxtLink>
        <NuxtLink to="/products?deals=1" class="hero__btn-secondary">See Deals</NuxtLink>
      </div>
    </div>

    <div class="hero__radiance" aria-hidden="true" />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 60vh;
  background: var(--color-inverse-surface);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-on-surface) 95%, transparent) 0%,
    color-mix(in srgb, var(--color-on-surface) 60%, transparent) 50%,
    transparent 100%
  );
  z-index: 1;
}

.hero__radiance {
  position: absolute;
  right: -5%;
  top: 50%;
  transform: translateY(-50%);
  width: 55%;
  height: 140%;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--color-primary-container) 20%, transparent) 0%,
    transparent 65%
  );
  z-index: 0;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 2;
  width: 100%;
  margin-inline: auto;
  padding: 5rem 1.5rem;
  max-width: 36rem;
  padding-left: clamp(1.5rem, 6vw, 6rem);
}

.hero__eyebrow {
  display: inline-block;
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary-container);
  background: color-mix(in srgb, var(--color-primary-container) 15%, transparent);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--color-primary-container) 30%, transparent);
  margin-bottom: 1.25rem;
}

.hero__title {
  font-family: var(--font-headline);
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--color-surface-container-lowest);
  margin: 0 0 1.25rem;
  text-transform: uppercase;
  font-style: italic;
}

.hero__body {
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--color-surface-container-high);
  margin: 0 0 2rem;
  max-width: 26rem;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  align-items: center;
}

.hero__btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 700;
  padding: 0.875rem 1.75rem;
  border-radius: var(--radius-DEFAULT);
  text-decoration: none;
  transition:
    box-shadow var(--transition-base),
    gap var(--transition-base);
}

.hero__btn-primary:hover {
  box-shadow: var(--shadow-btn-hover);
  gap: 0.75rem;
}

.hero__btn-primary:focus-visible {
  outline: 2px solid var(--color-primary-fixed);
  outline-offset: 3px;
}

.hero__btn-secondary {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-surface-container-lowest);
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-DEFAULT);
  border: 1px solid color-mix(in srgb, var(--color-surface-container-lowest) 25%, transparent);
  text-decoration: none;
  transition:
    background var(--transition-base),
    border-color var(--transition-base);
}

.hero__btn-secondary:hover {
  background: color-mix(in srgb, var(--color-surface-container-lowest) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-surface-container-lowest) 50%, transparent);
}

.hero__btn-secondary:focus-visible {
  outline: 2px solid var(--color-primary-fixed);
  outline-offset: 3px;
}
</style>
