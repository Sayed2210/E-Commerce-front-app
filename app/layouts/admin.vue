<template>
  <div class="min-h-screen bg-surface text-on-surface flex">
    <!-- Sidebar -->
    <nav class="fixed left-0 top-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant/15 z-40 flex flex-col">
      <!-- Brand -->
      <div class="px-6 py-8 border-b border-outline-variant/10">
        <h1 class="text-lg font-black text-on-surface tracking-tight font-headline">Admin Panel</h1>
        <p class="text-xs text-secondary mt-0.5">ArchitectMarket</p>
      </div>

      <!-- Nav links -->
      <div class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all"
          active-class="!text-primary !bg-surface-container-low border-r-2 border-primary-container font-semibold"
          exact-active-class="!text-primary !bg-surface-container-low border-r-2 border-primary-container font-semibold"
        >
          <span class="material-symbols-outlined text-xl">{{ link.icon }}</span>
          <span class="font-label">{{ link.label }}</span>
        </NuxtLink>
      </div>

      <!-- Bottom: new product + logout -->
      <div class="p-4 border-t border-outline-variant/10 space-y-3">
        <NuxtLink
          to="/admin/products/create"
          class="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-2.5 rounded text-sm font-semibold hover:brightness-95 transition-all"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          New Product
        </NuxtLink>
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:text-on-surface transition-colors"
        >
          <span class="material-symbols-outlined text-xl">logout</span>
          <span class="font-label">Logout</span>
        </button>
      </div>
    </nav>

    <!-- Main content -->
    <div class="ml-60 flex-1 flex flex-col min-h-screen">
      <!-- Top header -->
      <header class="sticky top-0 z-30 glass flex items-center justify-between px-8 py-3 shadow-sm">
        <!-- Breadcrumb -->
        <div class="text-xs text-secondary font-label">
          Admin / <span class="text-on-surface font-medium">{{ pageTitle }}</span>
        </div>

        <!-- Search + user -->
        <div class="flex items-center gap-6">
          <div class="relative hidden md:block">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">search</span>
            <input
              type="text"
              placeholder="Search…"
              class="bg-surface-container-low border-none rounded pl-9 pr-4 py-1.5 text-sm w-56 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div class="flex items-center gap-3">
            <button class="text-secondary hover:text-primary transition-colors">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <div class="flex items-center gap-2 pl-4 border-l border-outline-variant/20">
              <div class="text-right hidden sm:block">
                <p class="text-xs font-bold text-on-surface">{{ user?.firstName ?? user?.email }}</p>
                <p class="text-[10px] text-secondary">Administrator</p>
              </div>
              <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold">
                {{ userInitial }}
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout, user } = useAuth()
const route = useRoute()

const navLinks = [
  { to: '/admin',          icon: 'dashboard',   label: 'Dashboard'  },
  { to: '/admin/products', icon: 'inventory_2', label: 'Inventory'  },
  { to: '/admin/orders',   icon: 'shopping_bag',label: 'Orders'     },
  { to: '/admin/users',    icon: 'group',       label: 'Customers'  },
  { to: '/admin/analytics',icon: 'leaderboard', label: 'Analytics'  },
  { to: '/admin/coupons',  icon: 'local_offer', label: 'Coupons'    },
]

const pageTitles: Record<string, string> = {
  '/admin':            'Dashboard',
  '/admin/products':   'Inventory',
  '/admin/orders':     'Orders',
  '/admin/users':      'Customers',
  '/admin/analytics':  'Analytics',
  '/admin/coupons':    'Coupons',
}

const pageTitle = computed(() => pageTitles[route.path] ?? 'Admin')
const userInitial = computed(() => {
  const name = user.value?.firstName ?? user.value?.email ?? 'A'
  return name.charAt(0).toUpperCase()
})
</script>
