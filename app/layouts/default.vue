<script setup lang="ts">
import type { Category } from '~/types/api'

const { isAuthenticated } = useAuth()
const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)

const searchQuery = ref('')
const router = useRouter()
const mobileMenuOpen = ref(false)

const { listCategories, categoryIcon } = useCategories()
const { data: rawCategories } = await listCategories({ limit: 20 })
const categories = computed<Category[]>(() => rawCategories.value ?? [])

function doSearch() {
  const q = searchQuery.value.trim()
  if (q) router.push(`/products?q=${encodeURIComponent(q)}`)
}

const { fetchCart } = useCart()
onMounted(async () => {
  if (isAuthenticated.value) await fetchCart()
})
</script>

<template>
  <div class="layout">
    <!-- ── Sticky glass header ─────────────────────────────────────────── -->
    <header class="nav" role="banner">
      <div class="nav__inner">
        <!-- Logo -->
        <NuxtLink to="/" class="nav__logo" aria-label="ArchitectMarket — home">
          ArchitectMarket
        </NuxtLink>

        <!-- Primary nav links -->
        <nav class="nav__links" aria-label="Primary navigation">
          <NuxtLink to="/products" class="nav__link">Shop</NuxtLink>
          <NuxtLink to="/products?deals=1" class="nav__link">Deals</NuxtLink>
          <NuxtLink to="/wishlist" class="nav__link">Wishlist</NuxtLink>
        </nav>

        <!-- Search bar -->
        <div class="nav__search" role="search">
          <label for="nav-search" class="sr-only">Search products</label>
          <input
            id="nav-search"
            v-model="searchQuery"
            type="search"
            class="nav__search-input"
            placeholder="Search precision tools…"
            autocomplete="off"
            @keyup.enter="doSearch"
          />
          <button
            type="button"
            class="nav__search-btn"
            aria-label="Submit search"
            @click="doSearch"
          >
            <span class="material-symbols-outlined" aria-hidden="true">search</span>
          </button>
        </div>

        <!-- Actions -->
        <div class="nav__actions">
          <template v-if="isAuthenticated">
            <NuxtLink to="/account" class="nav__icon-btn" aria-label="My account">
              <span class="material-symbols-outlined" aria-hidden="true">person</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav__signin">Sign in</NuxtLink>
          </template>

          <!-- Cart -->
          <NuxtLink to="/cart" class="nav__icon-btn nav__cart" aria-label="Shopping cart">
            <span class="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
            <span
              v-if="itemCount > 0"
              class="nav__badge"
              :aria-label="`${itemCount} items in cart`"
              >{{ itemCount }}</span
            >
          </NuxtLink>

          <!-- Mobile burger -->
          <button
            type="button"
            class="nav__burger"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{
              mobileMenuOpen ? 'close' : 'menu'
            }}</span>
          </button>
        </div>
      </div>

      <!-- Category strip -->
      <div class="nav__cats" aria-label="Category navigation">
        <div class="nav__cats-inner" role="list">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/products?category=${cat.slug}`"
            class="nav__cat"
            role="listitem"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{
              categoryIcon(cat.slug)
            }}</span>
            {{ cat.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- Mobile flyout -->
      <nav v-if="mobileMenuOpen" id="mobile-nav" class="nav__mobile" aria-label="Mobile navigation">
        <NuxtLink to="/products" class="nav__mobile-link" @click="mobileMenuOpen = false"
          >Shop</NuxtLink
        >
        <NuxtLink to="/products?deals=1" class="nav__mobile-link" @click="mobileMenuOpen = false"
          >Deals</NuxtLink
        >
        <NuxtLink to="/wishlist" class="nav__mobile-link" @click="mobileMenuOpen = false"
          >Wishlist</NuxtLink
        >
        <NuxtLink
          v-if="isAuthenticated"
          to="/account"
          class="nav__mobile-link"
          @click="mobileMenuOpen = false"
          >My Account</NuxtLink
        >
        <NuxtLink v-else to="/login" class="nav__mobile-link" @click="mobileMenuOpen = false"
          >Sign in</NuxtLink
        >
      </nav>
    </header>

    <!-- ── Page content ────────────────────────────────────────────────── -->
    <main id="main-content">
      <slot />
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <footer class="footer" aria-label="Site footer">
      <div class="footer__grid">
        <!-- Brand column -->
        <div>
          <p class="footer__brand">ArchitectMarket</p>
          <p class="footer__tagline">
            High-density marketplace for precision tools and technical goods.
          </p>
        </div>

        <!-- Shop links -->
        <div>
          <h3 class="footer__heading">Shop</h3>
          <ul class="footer__list" role="list">
            <li><NuxtLink to="/products" class="footer__link">All Products</NuxtLink></li>
            <li><NuxtLink to="/products?deals=1" class="footer__link">Deals</NuxtLink></li>
          </ul>
        </div>

        <!-- Account links -->
        <div>
          <h3 class="footer__heading">Account</h3>
          <ul class="footer__list" role="list">
            <li><NuxtLink to="/account" class="footer__link">My Profile</NuxtLink></li>
            <li><NuxtLink to="/orders" class="footer__link">Orders</NuxtLink></li>
            <li><NuxtLink to="/wishlist" class="footer__link">Wishlist</NuxtLink></li>
          </ul>
        </div>

        <!-- Support links -->
        <div>
          <h3 class="footer__heading">Support</h3>
          <ul class="footer__list" role="list">
            <li><a href="#" class="footer__link">Help Center</a></li>
            <li><a href="#" class="footer__link">Contact Us</a></li>
            <li><a href="#" class="footer__link">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        © {{ new Date().getFullYear() }} ArchitectMarket. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ── Skip to content (WCAG) ──────────────────────────────────────────────── */
.layout:focus-within .sr-only:focus {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-DEFAULT);
}

/* ── Layout shell ────────────────────────────────────────────────────────── */
.layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  color: var(--color-on-surface);
}

#main-content {
  flex: 1;
}

/* ── Nav ─────────────────────────────────────────────────────────────────── */
.nav {
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  background: color-mix(in srgb, var(--color-surface-container-lowest) 80%, transparent);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.nav__inner {
  max-width: 88rem;
  margin-inline: auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Logo */
.nav__logo {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav__logo:hover {
  color: var(--color-primary);
}

.nav__logo:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* Primary links */
.nav__links {
  display: none;
  gap: 1.5rem;
}

@media (width >= 768px) {
  .nav__links {
    display: flex;
  }
}

.nav__link {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 180ms ease;
}

.nav__link:hover,
.nav__link.router-link-active {
  color: var(--color-primary);
}

.nav__link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* Search */
.nav__search {
  flex: 1;
  max-width: 28rem;
  margin-inline: auto;
  position: relative;
  display: none;
}

@media (width >= 640px) {
  .nav__search {
    display: block;
  }
}

.nav__search-input {
  width: 100%;
  background: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.5rem 1rem;
  padding-right: 2.75rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
  transition: box-shadow 200ms ease;
}

.nav__search-input:focus {
  box-shadow: 0 0 0 2px var(--color-primary);
}

.nav__search-input::placeholder {
  color: var(--color-on-surface-variant);
  opacity: 0.6;
}

.nav__search-btn {
  position: absolute;
  inset-block: 0.25rem;
  right: 0.25rem;
  padding: 0 0.5rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-DEFAULT);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 200ms ease;
}

.nav__search-btn:hover {
  opacity: 0.9;
}

.nav__search-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Actions */
.nav__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.nav__icon-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  color: var(--color-secondary);
  text-decoration: none;
  transition:
    color 180ms ease,
    background 180ms ease;
  position: relative;
}

.nav__icon-btn:hover {
  color: var(--color-primary);
  background: var(--color-surface-container-low);
}

.nav__icon-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.nav__badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.6rem;
  font-weight: 700;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.nav__signin {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-DEFAULT);
  transition: background 200ms ease;
}

.nav__signin:hover {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.nav__signin:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.nav__burger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  border-radius: var(--radius-full);
  transition:
    color 180ms ease,
    background 180ms ease;
}

.nav__burger:hover {
  color: var(--color-primary);
  background: var(--color-surface-container-low);
}

.nav__burger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@media (width >= 768px) {
  .nav__burger {
    display: none;
  }
}

/* Category strip */
.nav__cats {
  background: var(--color-surface-container-low);
}

.nav__cats-inner {
  max-width: 88rem;
  margin-inline: auto;
  padding: 0.5rem 1.5rem;
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav__cats-inner::-webkit-scrollbar {
  display: none;
}

.nav__cat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-secondary);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  padding-block: 0.125rem;
  transition: color 180ms ease;
}

.nav__cat:hover {
  color: var(--color-primary);
}

.nav__cat:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.nav__cat .material-symbols-outlined {
  font-size: 0.875rem;
}

/* Mobile flyout */
.nav__mobile {
  display: flex;
  flex-direction: column;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 20%, transparent);
  background: var(--color-surface-container-lowest);
  padding: 0.5rem;
}

.nav__mobile-link {
  font-family: var(--font-label);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-on-surface);
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-DEFAULT);
  transition:
    background 180ms ease,
    color 180ms ease;
}

.nav__mobile-link:hover {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
}

/* ── Footer ──────────────────────────────────────────────────────────────── */
.footer {
  background: var(--color-inverse-surface);
  color: var(--color-inverse-on-surface);
  margin-top: 5rem;
}

.footer__grid {
  max-width: 88rem;
  margin-inline: auto;
  padding: 3.5rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (width >= 640px) {
  .footer__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 1024px) {
  .footer__grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

.footer__brand {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-surface-container-lowest);
  margin: 0 0 0.5rem;
}

.footer__tagline {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-surface-container-high);
  margin: 0;
  max-width: 22rem;
  line-height: 1.6;
}

.footer__heading {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-surface-container-lowest);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 0.875rem;
}

.footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.footer__link {
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-surface-container-high);
  text-decoration: none;
  transition: color 180ms ease;
}

.footer__link:hover {
  color: var(--color-primary-fixed);
}

.footer__link:focus-visible {
  outline: 2px solid var(--color-primary-fixed);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.footer__bottom {
  max-width: 88rem;
  margin-inline: auto;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-surface-container-high) 20%, transparent);
  font-family: var(--font-label);
  font-size: 0.75rem;
  color: var(--color-surface-container-high);
  text-align: center;
}

/* .sr-only is defined globally in main.scss */
</style>
