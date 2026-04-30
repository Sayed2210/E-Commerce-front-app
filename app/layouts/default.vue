<script setup lang="ts">
import type { CategorySearchResult } from '~/types/api'

const { t } = useI18n()
const { isAuthenticated, logout } = useAuth()
const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)

const searchQuery = ref('')
const router = useRouter()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

function closeUserMenu() {
  userMenuOpen.value = false
}

const { listCategories, categoryIcon } = useCategories()
const { data: rawCategories } = await listCategories({ limit: 20 })
const categories = computed<CategorySearchResult>(
  () => rawCategories.value ?? { categories: [], total: 0, query: '', page: 1, limit: 20 }
)

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
        <NuxtLink to="/" class="nav__logo" :aria-label="t('brand.name') + ' — home'">
          {{ t('brand.name') }}
        </NuxtLink>

        <!-- Primary nav links -->
        <nav class="nav__links" :aria-label="$t('nav.primaryNavigation')">
          <NuxtLink to="/products" class="nav__link">{{ t('nav.shop') }}</NuxtLink>
          <NuxtLink to="/products?deals=1" class="nav__link">{{ t('nav.deals') }}</NuxtLink>
          <NuxtLink to="/wishlist" class="nav__link">{{ t('nav.wishlist') }}</NuxtLink>
        </nav>

        <!-- Search bar -->
        <div class="nav__search" role="search">
          <label for="nav-search" class="sr-only">{{ t('nav.searchLabel') }}</label>
          <input
            id="nav-search"
            v-model="searchQuery"
            type="search"
            class="nav__search-input"
            :placeholder="t('nav.searchPlaceholder')"
            autocomplete="off"
            @keyup.enter="doSearch"
          />
          <button
            type="button"
            class="nav__search-btn"
            :aria-label="t('nav.searchSubmit')"
            @click="doSearch"
          >
            <span class="material-symbols-outlined" aria-hidden="true">search</span>
          </button>
        </div>

        <!-- Actions -->
        <div class="nav__actions">
          <LangSwitcher />
          <CurrencySwitcher />
          <template v-if="isAuthenticated">
            <NotificationBell />
            <div ref="userMenuRef" class="nav__user-menu">
              <button
                type="button"
                class="nav__icon-btn"
                :aria-label="t('nav.userMenu')"
                :aria-expanded="userMenuOpen"
                @click="userMenuOpen = !userMenuOpen"
              >
                <span class="material-symbols-outlined" aria-hidden="true">person</span>
              </button>
              <div v-if="userMenuOpen" class="nav__dropdown" role="menu">
                <NuxtLink
                  to="/account"
                  class="nav__dropdown-item"
                  role="menuitem"
                  @click="closeUserMenu"
                >
                  <span class="material-symbols-outlined" aria-hidden="true">manage_accounts</span>
                  {{ t('nav.account') }}
                </NuxtLink>
                <button
                  type="button"
                  class="nav__dropdown-item nav__dropdown-item--danger"
                  role="menuitem"
                  @click="logout"
                >
                  <span class="material-symbols-outlined" aria-hidden="true">logout</span>
                  {{ t('nav.signOut') }}
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav__signin">{{ t('nav.signIn') }}</NuxtLink>
          </template>

          <!-- Cart -->
          <NuxtLink to="/cart" class="nav__icon-btn nav__cart" :aria-label="t('nav.cart')">
            <span class="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
            <span
              v-if="itemCount > 0"
              class="nav__badge"
              :aria-label="t('nav.cartItems', { count: itemCount })"
              >{{ itemCount }}</span
            >
          </NuxtLink>

          <!-- Mobile burger -->
          <button
            type="button"
            class="nav__burger"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-nav"
            :aria-label="t('nav.mobileMenuToggle')"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="material-symbols-outlined" aria-hidden="true">{{
              mobileMenuOpen ? 'close' : 'menu'
            }}</span>
          </button>
        </div>
      </div>

      <!-- Category strip -->
      <div class="nav__cats" :aria-label="t('nav.categoryNavigation')">
        <div class="nav__cats-inner" role="list">
          <NuxtLink
            v-for="cat in categories.categories"
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
      <nav
        v-if="mobileMenuOpen"
        id="mobile-nav"
        class="nav__mobile"
        :aria-label="t('nav.mobileNavigation')"
      >
        <NuxtLink to="/products" class="nav__mobile-link" @click="mobileMenuOpen = false">{{
          t('nav.shop')
        }}</NuxtLink>
        <NuxtLink to="/products?deals=1" class="nav__mobile-link" @click="mobileMenuOpen = false">{{
          t('nav.deals')
        }}</NuxtLink>
        <NuxtLink to="/wishlist" class="nav__mobile-link" @click="mobileMenuOpen = false">{{
          t('nav.wishlist')
        }}</NuxtLink>
        <template v-if="isAuthenticated">
          <NuxtLink to="/account" class="nav__mobile-link" @click="mobileMenuOpen = false">{{
            t('nav.account')
          }}</NuxtLink>
          <button type="button" class="nav__mobile-link nav__mobile-link--danger" @click="logout">
            {{ t('nav.signOut') }}
          </button>
        </template>
        <NuxtLink v-else to="/login" class="nav__mobile-link" @click="mobileMenuOpen = false">{{
          t('nav.signIn')
        }}</NuxtLink>
      </nav>
    </header>

    <!-- ── Page content ────────────────────────────────────────────────── -->
    <main id="main-content">
      <slot />
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────── -->
    <footer class="footer" role="contentinfo">
      <div class="footer__grid">
        <!-- Brand column -->
        <div>
          <p class="footer__brand">{{ t('brand.name') }}</p>
          <p class="footer__tagline">
            {{ t('footer.tagline') }}
          </p>
        </div>

        <!-- Shop links -->
        <div>
          <h3 class="footer__heading">{{ t('footer.shop') }}</h3>
          <ul class="footer__list" role="list">
            <li>
              <NuxtLink to="/products" class="footer__link">{{ t('footer.allProducts') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products?deals=1" class="footer__link">{{ t('nav.deals') }}</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Account links -->
        <div>
          <h3 class="footer__heading">{{ t('footer.account') }}</h3>
          <ul class="footer__list" role="list">
            <li>
              <NuxtLink to="/account" class="footer__link">{{ t('footer.myProfile') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/orders" class="footer__link">{{ t('footer.orders') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/wishlist" class="footer__link">{{ t('nav.wishlist') }}</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support links -->
        <div>
          <h3 class="footer__heading">{{ t('footer.support') }}</h3>
          <ul class="footer__list" role="list">
            <li>
              <a href="#" class="footer__link">{{ t('footer.helpCenter') }}</a>
            </li>
            <li>
              <a href="#" class="footer__link">{{ t('footer.contactUs') }}</a>
            </li>
            <li>
              <a href="#" class="footer__link">{{ t('footer.privacyPolicy') }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
@use 'layout';
</style>
