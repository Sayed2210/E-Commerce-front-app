<script setup lang="ts">
import { UserRole } from '~/types/auth'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { user, fetchUser } = useAuth()
const { apiCall } = useApiClient()

const saving = ref(false)
const saved = ref(false)

const form = reactive({
  firstName: user.value?.firstName ?? '',
  lastName: user.value?.lastName ?? '',
  phone: user.value?.phone ?? '',
})

const pwForm = reactive({ current: '', newPw: '', confirm: '' })

watch(
  user,
  (u) => {
    if (u) {
      form.firstName = u.firstName ?? ''
      form.lastName = u.lastName ?? ''
    }
  },
  { immediate: true }
)

const userInitial = computed(() => {
  const n = user.value?.firstName ?? user.value?.email ?? 'U'
  return n.charAt(0).toUpperCase()
})
const fullName = computed(() => {
  const f = user.value?.firstName ?? ''
  const l = user.value?.lastName ?? ''
  return f || l ? `${f} ${l}`.trim() : (user.value?.email ?? '')
})
const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
})

const accountLinks = [
  { to: '/orders', icon: 'shopping_bag', label: 'My Orders' },
  { to: '/wishlist', icon: 'favorite_border', label: 'Wishlist' },
  { to: '/cart', icon: 'shopping_cart', label: 'Cart' },
]

async function saveProfile() {
  saving.value = true
  await apiCall('/users/me', {
    method: 'PATCH',
    body: { firstName: form.firstName, lastName: form.lastName, phone: form.phone },
  })
  await fetchUser()
  saving.value = false
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 3000)
}

function changePassword() {
  if (pwForm.newPw !== pwForm.confirm) {
    alert('Passwords do not match')
    return
  }
  // POST /auth/reset-password (needs current password flow)
}

useSeoMeta({ title: 'Profile Settings — ArchitectMarket' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="flex items-end justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-on-surface font-headline">Profile Settings</h1>
        <p class="text-secondary text-sm mt-1">Manage your account details and preferences</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left: Profile card -->
      <div class="lg:col-span-4 space-y-4">
        <!-- Avatar card -->
        <div class="bg-surface-container-lowest rounded p-8 flex flex-col items-center text-center">
          <div
            class="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-3xl font-bold font-headline mb-4"
          >
            {{ userInitial }}
          </div>
          <h2 class="font-bold text-lg text-on-surface font-headline">{{ fullName }}</h2>
          <p class="text-secondary text-sm">{{ user?.email }}</p>
          <span class="mt-3 micro-chip bg-surface-container text-secondary">
            {{ user?.roles?.includes(UserRole.ADMIN) ? 'Administrator' : 'Customer' }}
          </span>
          <p class="text-xs text-secondary mt-3">Member since {{ memberSince }}</p>
        </div>

        <!-- Quick nav -->
        <div class="bg-surface-container-lowest rounded overflow-hidden">
          <NuxtLink
            v-for="link in accountLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-5 py-3.5 text-sm text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors border-b border-outline-variant/10 last:border-0"
          >
            <span class="material-symbols-outlined text-xl">{{ link.icon }}</span>
            {{ link.label }}
            <span class="material-symbols-outlined text-sm ml-auto text-outline-variant"
              >chevron_right</span
            >
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Edit form -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Personal info -->
        <div class="bg-surface-container-lowest rounded p-8">
          <h2 class="font-bold text-on-surface font-headline mb-6">Personal Information</h2>
          <form class="space-y-5" @submit.prevent="saveProfile">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="text-xs font-bold uppercase tracking-wider text-secondary block mb-2"
                  >First Name</label
                >
                <input
                  v-model="form.firstName"
                  type="text"
                  class="w-full bg-surface-container-low border-none border-b-2 border-b-outline/30 focus:border-b-primary rounded py-2.5 px-4 text-sm outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="text-xs font-bold uppercase tracking-wider text-secondary block mb-2"
                  >Last Name</label
                >
                <input
                  v-model="form.lastName"
                  type="text"
                  class="w-full bg-surface-container-low border-none border-b-2 border-b-outline/30 focus:border-b-primary rounded py-2.5 px-4 text-sm outline-none transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label class="text-xs font-bold uppercase tracking-wider text-secondary block mb-2"
                >Email Address</label
              >
              <input
                :value="user?.email"
                type="email"
                readonly
                class="w-full bg-surface-container border-none rounded py-2.5 px-4 text-sm text-secondary cursor-not-allowed"
              />
              <p class="text-xs text-secondary mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label class="text-xs font-bold uppercase tracking-wider text-secondary block mb-2"
                >Phone Number</label
              >
              <input
                v-model="form.phone"
                type="tel"
                class="w-full bg-surface-container-low border-none border-b-2 border-b-outline/30 focus:border-b-primary rounded py-2.5 px-4 text-sm outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div class="flex items-center gap-4 pt-2">
              <button
                type="submit"
                :disabled="saving"
                class="bg-primary-container text-on-primary-container px-8 py-2.5 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all disabled:opacity-60"
              >
                {{ saving ? 'Saving…' : 'Save Changes' }}
              </button>
              <p v-if="saved" class="text-green-600 text-xs flex items-center gap-1">
                <span
                  class="material-symbols-outlined text-sm"
                  style="font-variation-settings: 'FILL' 1"
                  >check_circle</span
                >
                Profile updated!
              </p>
            </div>
          </form>
        </div>

        <!-- Password change -->
        <div class="bg-surface-container-lowest rounded p-8">
          <h2 class="font-bold text-on-surface font-headline mb-6">Change Password</h2>
          <form class="space-y-5" @submit.prevent="changePassword">
            <div>
              <label class="text-xs font-bold uppercase tracking-wider text-secondary block mb-2"
                >Current Password</label
              >
              <input
                v-model="pwForm.current"
                type="password"
                class="w-full bg-surface-container-low border-none border-b-2 border-b-outline/30 focus:border-b-primary rounded py-2.5 px-4 text-sm outline-none transition-colors"
              />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="text-xs font-bold uppercase tracking-wider text-secondary block mb-2"
                  >New Password</label
                >
                <input
                  v-model="pwForm.newPw"
                  type="password"
                  class="w-full bg-surface-container-low border-none border-b-2 border-b-outline/30 focus:border-b-primary rounded py-2.5 px-4 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label class="text-xs font-bold uppercase tracking-wider text-secondary block mb-2"
                  >Confirm New Password</label
                >
                <input
                  v-model="pwForm.confirm"
                  type="password"
                  class="w-full bg-surface-container-low border-none border-b-2 border-b-outline/30 focus:border-b-primary rounded py-2.5 px-4 text-sm outline-none transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              class="bg-primary-container text-on-primary-container px-8 py-2.5 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
