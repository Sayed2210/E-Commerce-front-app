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
            <NotificationBell />
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

<style lang="scss">
@use 'layout';
</style>
