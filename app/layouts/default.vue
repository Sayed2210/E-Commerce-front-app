<template>
  <div class="min-h-screen bg-surface text-on-surface">
    <!-- Top nav -->
    <header class="sticky top-0 z-50 glass shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <!-- Logo + nav links -->
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="text-xl font-bold tracking-tight text-on-surface font-headline">
            ArchitectMarket
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/products"  class="text-secondary hover:text-primary transition-colors text-sm">Categories</NuxtLink>
            <NuxtLink to="/products?deals=1" class="text-secondary hover:text-primary transition-colors text-sm">Deals</NuxtLink>
            <NuxtLink to="/wishlist"  class="text-secondary hover:text-primary transition-colors text-sm">Wishlist</NuxtLink>
          </nav>
        </div>

        <!-- Search + actions -->
        <div class="flex items-center gap-4 flex-1 justify-end max-w-xl ml-8">
          <div class="relative w-full hidden sm:block group">
            <input
              v-model="searchQuery"
              @keyup.enter="doSearch"
              type="text"
              placeholder="Search precision tools…"
              class="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 text-sm py-2 pl-4 pr-12 rounded-lg outline-none"
            />
            <button
              @click="doSearch"
              class="absolute right-1 top-1 bottom-1 bg-primary-container text-on-primary-container px-3 rounded flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all"
            >
              <span class="material-symbols-outlined text-lg">search</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <!-- Profile -->
            <template v-if="isAuthenticated">
              <NuxtLink to="/account" class="p-2 text-secondary hover:text-primary transition-colors">
                <span class="material-symbols-outlined">person</span>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-sm font-semibold text-primary hover:underline">
                Sign in
              </NuxtLink>
            </template>

            <!-- Cart -->
            <NuxtLink to="/cart" class="relative p-2 text-secondary hover:text-primary transition-colors">
              <span class="material-symbols-outlined">shopping_cart</span>
              <span
                v-if="itemCount > 0"
                class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none"
              >{{ itemCount }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Category nav strip -->
      <div class="bg-surface-container-low border-t border-outline-variant/10">
        <div class="max-w-7xl mx-auto px-6 py-2 overflow-x-auto scrollbar-hide">
          <div class="flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-secondary whitespace-nowrap">
            <NuxtLink v-for="cat in categories" :key="cat.slug" :to="`/products?category=${cat.slug}`"
              class="hover:text-primary transition-colors flex items-center gap-1 shrink-0">
              <span class="material-symbols-outlined text-sm">{{ cat.icon }}</span>
              {{ cat.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-on-surface text-inverse-on-surface mt-16">
      <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-bold font-headline text-surface-container-lowest mb-3">ArchitectMarket</h3>
          <p class="text-sm text-surface-container-high">High-density marketplace for precision tools and technical goods.</p>
        </div>
        <div>
          <h4 class="font-semibold text-surface-container-lowest mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/products" class="text-sm text-surface-container-high hover:text-primary-fixed transition-colors">All Products</NuxtLink></li>
            <li><NuxtLink to="/products?deals=1" class="text-sm text-surface-container-high hover:text-primary-fixed transition-colors">Deals</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-surface-container-lowest mb-3 text-sm uppercase tracking-wider">Account</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/account" class="text-sm text-surface-container-high hover:text-primary-fixed transition-colors">My Profile</NuxtLink></li>
            <li><NuxtLink to="/orders"  class="text-sm text-surface-container-high hover:text-primary-fixed transition-colors">Orders</NuxtLink></li>
            <li><NuxtLink to="/wishlist" class="text-sm text-surface-container-high hover:text-primary-fixed transition-colors">Wishlist</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-surface-container-lowest mb-3 text-sm uppercase tracking-wider">Support</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-sm text-surface-container-high hover:text-primary-fixed transition-colors">Help Center</a></li>
            <li><a href="#" class="text-sm text-surface-container-high hover:text-primary-fixed transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-surface-container-high/20 px-6 py-4 text-center text-xs text-surface-container-high max-w-7xl mx-auto">
        © {{ new Date().getFullYear() }} ArchitectMarket. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
const cartStore = useCartStore()
const itemCount = computed(() => cartStore.itemCount)
const searchQuery = ref('')
const router = useRouter()

const categories = [
  { slug: 'electronics',  label: 'Electronics',  icon: 'laptop_mac'      },
  { slug: 'home',         label: 'Home',          icon: 'home'            },
  { slug: 'fashion',      label: 'Fashion',       icon: 'checkroom'       },
  { slug: 'industrial',   label: 'Industrial',    icon: 'construction'    },
  { slug: 'books',        label: 'Books',         icon: 'auto_stories'    },
  { slug: 'sports',       label: 'Sports',        icon: 'fitness_center'  },
  { slug: 'toys',         label: 'Toys',          icon: 'toys'            },
  { slug: 'health',       label: 'Health',        icon: 'local_pharmacy'  },
]

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/products?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

// Hydrate cart if logged in
const { fetchCart } = useCart()
onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchCart()
  }
})
</script>
