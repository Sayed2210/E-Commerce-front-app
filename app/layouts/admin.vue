<script setup lang="ts">
const { t } = useI18n()
const { logout, user } = useAuth()
const route = useRoute()

useSeoMeta({ robots: 'noindex, nofollow' })

const navLinks = computed(() => [
  { to: '/admin', icon: 'dashboard', label: t('admin.dashboard') },
  { to: '/admin/products', icon: 'inventory_2', label: t('admin.inventory') },
  { to: '/admin/categories', icon: 'category', label: t('admin.categories') },
  { to: '/admin/brands', icon: 'business', label: t('admin.brands') },
  { to: '/admin/tags', icon: 'sell', label: t('admin.tags') },
  { to: '/admin/orders', icon: 'shopping_bag', label: t('admin.orders') },
  { to: '/admin/staff', icon: 'admin_panel_settings', label: t('admin.staff') },
  { to: '/admin/users', icon: 'group', label: t('admin.customers') },
  { to: '/admin/analytics', icon: 'leaderboard', label: t('admin.analytics') },
  { to: '/admin/coupons', icon: 'local_offer', label: t('admin.coupons') },
  { to: '/admin/returns', icon: 'assignment_return', label: t('admin.returns') },
  { to: '/admin/newsletter', icon: 'mail', label: t('admin.newsletter') },
  { to: '/admin/search', icon: 'manage_search', label: t('admin.search') },
])

const pageTitles = computed<Record<string, string>>(() => ({
  '/admin': t('admin.dashboard'),
  '/admin/products': t('admin.inventory'),
  '/admin/categories': t('admin.categories'),
  '/admin/brands': t('admin.brands'),
  '/admin/tags': t('admin.tags'),
  '/admin/orders': t('admin.orders'),
  '/admin/staff': t('admin.staff'),
  '/admin/users': t('admin.customers'),
  '/admin/analytics': t('admin.analytics'),
  '/admin/coupons': t('admin.coupons'),
  '/admin/returns': t('admin.returns'),
  '/admin/newsletter': t('admin.newsletter'),
  '/admin/search': t('admin.search'),
}))

const pageTitle = computed(() => pageTitles.value[route.path] ?? t('admin.breadcrumb'))
const userInitial = computed(() => {
  const name = user.value?.firstName ?? user.value?.email ?? 'A'
  return name.charAt(0).toUpperCase()
})
</script>

<template>
  <div class="min-h-screen bg-surface text-on-surface flex">
    <!-- Sidebar -->
    <nav
      class="fixed left-0 top-0 h-screen w-60 bg-surface-container-lowest border-r border-outline-variant/15 z-40 flex flex-col"
    >
      <!-- Brand -->
      <div class="px-6 py-8 border-b border-outline-variant/10">
        <h1 class="text-lg font-black text-on-surface tracking-tight font-headline">
          {{ t('admin.panel') }}
        </h1>
        <p class="text-xs text-secondary mt-0.5">{{ t('brand.name') }}</p>
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
          <span class="material-symbols-outlined text-sm" aria-hidden="true">add</span>
          {{ t('admin.newProduct') }}
        </NuxtLink>
        <button
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:text-on-surface transition-colors"
          @click="logout"
        >
          <span class="material-symbols-outlined text-xl" aria-hidden="true">logout</span>
          <span class="font-label">{{ t('admin.logout') }}</span>
        </button>
      </div>
    </nav>

    <!-- Main content -->
    <div class="ml-60 flex-1 flex flex-col min-h-screen">
      <!-- Top header -->
      <header class="sticky top-0 z-30 glass flex items-center justify-between px-8 py-3 shadow-sm">
        <!-- Breadcrumb -->
        <div class="text-xs text-secondary font-label">
          {{ t('admin.breadcrumb') }} /
          <span class="text-on-surface font-medium">{{ pageTitle }}</span>
        </div>

        <!-- Search + user -->
        <div class="flex items-center gap-6">
          <div class="relative hidden md:block">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm"
              aria-hidden="true"
              >search</span
            >
            <input
              type="text"
              :placeholder="t('admin.searchPlaceholder')"
              class="bg-surface-container-low border-none rounded pl-9 pr-4 py-1.5 text-sm w-56 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div class="flex items-center gap-3">
            <LangSwitcher />
            <button
              type="button"
              class="text-secondary hover:text-primary transition-colors"
              :aria-label="t('admin.notifications')"
            >
              <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
            <div class="flex items-center gap-2 pl-4 border-l border-outline-variant/20">
              <div class="text-right hidden sm:block">
                <p class="text-xs font-bold text-on-surface">
                  {{ user?.firstName ?? user?.email }}
                </p>
                <p class="text-[10px] text-secondary">{{ t('admin.administrator') }}</p>
              </div>
              <div
                class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-sm font-bold"
              >
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
