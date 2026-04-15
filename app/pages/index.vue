<script setup lang="ts">
import type { Product, Category } from '~/types/api'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'ArchitectMarket — Precision Tools Marketplace' })

const { listProducts } = useProducts()
const { listCategories, categoryIcon } = useCategories()
const { addItem } = useCart()

const newsletter = ref('')
const newsletterSent = ref(false)

const [{ data: productsData, pending }, { data: rawCategories }] = await Promise.all([
  listProducts({ limit: 8 }),
  listCategories({ limit: 8 }),
])

const products = computed<Product[]>(() => {
  const d = productsData.value as any
  return d?.data ?? d ?? []
})

const categories = computed<Category[]>(() => rawCategories.value ?? [])

async function quickAddToCart(productId: string) {
  await addItem({ productId, quantity: 1 })
}

function submitNewsletter() {
  if (newsletter.value.trim()) newsletterSent.value = true
}
</script>

<template>
  <div>
    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
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
          <NuxtLink to="/products?deals=1" class="hero__btn-secondary"> See Deals </NuxtLink>
        </div>
      </div>

      <!-- Decorative amber radiance -->
      <div class="hero__radiance" aria-hidden="true" />
    </section>

    <!-- ── Categories ────────────────────────────────────────────────────── -->
    <section class="section" aria-labelledby="cats-heading">
      <SectionHeader
        id="cats-heading"
        title="Shop by Category"
        subtitle="Explore our curated collections"
        link="/products"
      />

      <ul class="cats-grid" role="list" aria-label="Product categories">
        <li v-for="cat in categories" :key="cat.slug">
          <NuxtLink :to="`/products?category=${cat.slug}`" class="cat-card">
            <span class="cat-card__icon material-symbols-outlined" aria-hidden="true">
              {{ categoryIcon(cat.slug) }}
            </span>
            <span class="cat-card__name">{{ cat.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- ── Featured Products ─────────────────────────────────────────────── -->
    <section class="section section--tinted" aria-labelledby="featured-heading">
      <SectionHeader
        id="featured-heading"
        title="Featured Products"
        subtitle="Editor's picks for the season"
        link="/products"
      />

      <ul class="product-grid" role="list" aria-label="Featured products">
        <template v-if="pending">
          <li v-for="i in 8" :key="i">
            <ProductSkeleton />
          </li>
        </template>
        <template v-else>
          <li v-for="product in products" :key="product.id">
            <ProductCard :product="product" :wishlist="true" @add-to-cart="quickAddToCart" />
          </li>
        </template>
      </ul>

      <div v-if="!pending" class="section__cta">
        <NuxtLink to="/products" class="section__see-all">
          View all products
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </NuxtLink>
      </div>
    </section>

    <!-- ── Value proposition strip ───────────────────────────────────────── -->
    <section class="perks" aria-label="Shopping benefits">
      <div class="perks__inner">
        <div
          v-for="perk in [
            { icon: 'local_shipping', title: 'Free Shipping', body: 'On all orders over $99' },
            {
              icon: 'verified',
              title: 'Authenticity Guaranteed',
              body: 'Every item curated and verified',
            },
            { icon: 'replay', title: '30-Day Returns', body: 'Hassle-free return policy' },
            {
              icon: 'headset_mic',
              title: '24/7 Support',
              body: 'Expert help whenever you need it',
            },
          ]"
          :key="perk.icon"
          class="perk"
        >
          <span class="perk__icon material-symbols-outlined" aria-hidden="true">{{
            perk.icon
          }}</span>
          <div>
            <p class="perk__title">{{ perk.title }}</p>
            <p class="perk__body">{{ perk.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Newsletter ─────────────────────────────────────────────────────── -->
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
          <template v-if="!newsletterSent">
            <form
              class="newsletter__form"
              aria-label="Newsletter sign up"
              @submit.prevent="submitNewsletter"
            >
              <label for="newsletter-email" class="sr-only">Email address</label>
              <input
                id="newsletter-email"
                v-model="newsletter"
                type="email"
                class="newsletter__input"
                placeholder="Enter your email address"
                autocomplete="email"
                :required="true"
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
  </div>
</template>

<style scoped>
/* ── Section base ────────────────────────────────────────────────────────── */
.section {
  max-width: 88rem;
  margin-inline: auto;
  padding: 4rem 1.5rem;
}

.section--tinted {
  max-width: 100%;
  background: var(--color-surface-container-low);
  padding-inline: 0;
}

.section--tinted > * {
  max-width: 88rem;
  margin-inline: auto;
  padding-inline: 1.5rem;
}

.section__cta {
  display: flex;
  justify-content: center;
  padding-top: 2.5rem;
}

.section__see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-DEFAULT);
  border: 1px solid color-mix(in srgb, var(--color-outline) 25%, transparent);
  transition: all 200ms ease;
}

.section__see-all:hover {
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
  border-color: color-mix(in srgb, var(--color-outline) 50%, transparent);
  gap: 0.625rem;
}

.section__see-all:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ── Hero ────────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 60vh;
  background: var(--color-inverse-surface);
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* Subtle warm gradient overlay */
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

/* Amber radiance blob */
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
    box-shadow 200ms ease,
    gap 200ms ease;
}

.hero__btn-primary:hover {
  box-shadow: 0 10px 28px color-mix(in srgb, var(--color-primary) 35%, transparent);
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
    background 200ms ease,
    border-color 200ms ease;
}

.hero__btn-secondary:hover {
  background: color-mix(in srgb, var(--color-surface-container-lowest) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-surface-container-lowest) 50%, transparent);
}

.hero__btn-secondary:focus-visible {
  outline: 2px solid var(--color-primary-fixed);
  outline-offset: 3px;
}

/* ── Category grid ───────────────────────────────────────────────────────── */
.cats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (width >= 480px) {
  .cats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 768px) {
  .cats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (width >= 1024px) {
  .cats-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem 0.5rem;
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition:
    box-shadow 200ms ease,
    transform 200ms ease;
}

.cat-card:hover {
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-on-surface) 6%, transparent);
  transform: translateY(-2px);
}

.cat-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.cat-card__icon {
  font-size: 1.75rem;
  color: var(--color-primary);
  transition: transform 200ms ease;
}

.cat-card:hover .cat-card__icon {
  transform: scale(1.1);
}

.cat-card__name {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-on-surface);
  text-align: center;
  transition: color 200ms ease;
}

.cat-card:hover .cat-card__name {
  color: var(--color-primary);
}

/* ── Product grid ────────────────────────────────────────────────────────── */
.product-grid {
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  list-style: none;
  margin: 0 auto;
  padding: 0;
}

@media (width >= 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ── Perks strip ─────────────────────────────────────────────────────────── */
.perks {
  background: var(--color-surface-container);
}

.perks__inner {
  max-width: 88rem;
  margin-inline: auto;
  padding: 2.5rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (width >= 1024px) {
  .perks__inner {
    grid-template-columns: repeat(4, 1fr);
  }
}

.perk {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.perk__icon {
  font-size: 1.5rem;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 0.0625rem;
}

.perk__title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 0.25rem;
}

.perk__body {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-on-surface-variant);
  margin: 0;
  line-height: 1.5;
}

/* ── Newsletter ──────────────────────────────────────────────────────────── */
.newsletter {
  background: var(--color-inverse-surface);
  margin-top: 0;
}

.newsletter__inner {
  position: relative;
  overflow: hidden;
  max-width: 88rem;
  margin-inline: auto;
  padding: 4rem 1.5rem;
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

/* Amber glow accent behind newsletter */
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
    border-color 200ms ease,
    background 200ms ease;
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
  transition: box-shadow 200ms ease;
}

.newsletter__btn:hover {
  box-shadow: 0 6px 20px color-mix(in srgb, var(--color-primary) 30%, transparent);
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

/* ── Utility ─────────────────────────────────────────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
}
</style>
