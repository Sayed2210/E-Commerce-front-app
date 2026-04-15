<script setup lang="ts">
const { email, sent, submit } = useNewsletter()
</script>

<template>
  <section class="newsletter" aria-labelledby="newsletter-heading">
    <div class="newsletter__inner">
      <div class="newsletter__glow" aria-hidden="true" />

      <div class="newsletter__text">
        <h2 id="newsletter-heading" class="newsletter__title">Join the Inner Circle</h2>
        <p class="newsletter__sub">
          Receive exclusive drops, editorial picks, and early access deals.
        </p>
      </div>

      <div class="newsletter__form-wrap">
        <template v-if="!sent">
          <form class="newsletter__form" aria-label="Newsletter sign up" @submit.prevent="submit">
            <label for="newsletter-email" class="sr-only">Email address</label>
            <input
              id="newsletter-email"
              v-model="email"
              type="email"
              class="newsletter__input"
              placeholder="Enter your email address"
              autocomplete="email"
              required
            />
            <button type="submit" class="newsletter__btn" aria-label="Subscribe to newsletter">
              Subscribe
              <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
          </form>
        </template>
        <div v-else class="newsletter__thanks" role="status" aria-live="polite">
          <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
          You're on the list — thank you!
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.newsletter {
  background: var(--color-inverse-surface);
}

.newsletter__inner {
  position: relative;
  overflow: hidden;
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 4rem var(--container-pad);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  text-align: center;
}

@media (width >= 768px) {
  .newsletter__inner {
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
  }
}

.newsletter__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 200%;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--color-primary-container) 8%, transparent) 0%,
    transparent 60%
  );
  pointer-events: none;
}

.newsletter__text {
  flex: 1;
  max-width: 30rem;
}

.newsletter__title {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-surface-container-lowest);
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  font-style: italic;
}

.newsletter__sub {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-surface-container-high);
  margin: 0;
  line-height: 1.6;
}

.newsletter__form-wrap {
  flex-shrink: 0;
  width: 100%;
  max-width: 22rem;
}

.newsletter__form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.newsletter__input {
  flex: 1;
  min-width: 14rem;
  background: color-mix(in srgb, var(--color-surface-container-lowest) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-surface-container-lowest) 20%, transparent);
  border-radius: var(--radius-DEFAULT);
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-surface-container-lowest);
  outline: none;
  transition:
    border-color var(--transition-base),
    background var(--transition-base);
}

.newsletter__input::placeholder {
  color: var(--color-surface-container-high);
}

.newsletter__input:focus {
  border-color: var(--color-primary-container);
  background: color-mix(in srgb, var(--color-surface-container-lowest) 15%, transparent);
}

.newsletter__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.75rem 1.375rem;
  border: none;
  border-radius: var(--radius-DEFAULT);
  cursor: pointer;
  white-space: nowrap;
  transition: box-shadow var(--transition-base);
}

.newsletter__btn:hover {
  box-shadow: var(--shadow-btn-primary);
}

.newsletter__btn:focus-visible {
  outline: 2px solid var(--color-primary-fixed);
  outline-offset: 3px;
}

.newsletter__thanks {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary-fixed);
}

.newsletter__thanks .material-symbols-outlined {
  font-size: 1.375rem;
  color: var(--color-primary-container);
}
</style>
