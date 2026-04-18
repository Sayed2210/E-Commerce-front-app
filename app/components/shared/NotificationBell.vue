<script setup lang="ts">
import { useNotificationsStore } from '~/stores/notifications'
import { showErrorToast } from '~/utils/errorHandler'

const notificationsStore = useNotificationsStore()
const { listNotifications, markAsRead, markAllAsRead } = useNotifications()

const open = ref(false)
const bell = ref<HTMLElement | null>(null)

const unreadCount = computed(() => notificationsStore.unreadCount)
const recent = computed(() => notificationsStore.recent)

onMounted(async () => {
  if (!notificationsStore.loaded) {
    const { data } = await listNotifications()
    if (data) notificationsStore.setAll(data)
  }
})

function toggle() {
  open.value = !open.value
}

async function handleMarkRead(id: string) {
  notificationsStore.markRead(id)
  await markAsRead(id)
}

async function handleMarkAllRead() {
  notificationsStore.markAllRead()
  const { error } = await markAllAsRead()
  if (error) showErrorToast(error)
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

onClickOutside(bell, () => {
  open.value = false
})
</script>

<template>
  <div ref="bell" class="notif-bell">
    <button
      type="button"
      class="notif-bell__btn"
      :aria-label="`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="toggle"
    >
      <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
      <span v-if="unreadCount > 0" class="notif-bell__badge" aria-hidden="true">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <Transition name="notif-drop">
      <div v-if="open" class="notif-bell__dropdown" role="dialog" aria-label="Notifications">
        <div class="notif-bell__drop-head">
          <span class="notif-bell__drop-title">Notifications</span>
          <button
            v-if="unreadCount > 0"
            type="button"
            class="notif-bell__mark-all"
            @click="handleMarkAllRead"
          >
            Mark all read
          </button>
        </div>

        <ul v-if="recent.length" class="notif-bell__list" role="list">
          <li
            v-for="n in recent"
            :key="n.id"
            class="notif-bell__item"
            :class="{ 'notif-bell__item--unread': !n.isRead }"
            @click="handleMarkRead(n.id)"
          >
            <span class="notif-bell__item-icon">
              <span class="material-symbols-outlined" aria-hidden="true">
                {{
                  n.type === 'order'
                    ? 'shopping_bag'
                    : n.type === 'promo'
                      ? 'local_offer'
                      : n.type === 'review'
                        ? 'star'
                        : 'info'
                }}
              </span>
            </span>
            <span class="notif-bell__item-body">
              <span class="notif-bell__item-title">{{ n.title }}</span>
              <span class="notif-bell__item-msg">{{ n.message }}</span>
              <span class="notif-bell__item-time">{{ timeAgo(n.createdAt) }}</span>
            </span>
            <span v-if="!n.isRead" class="notif-bell__unread-dot" aria-hidden="true" />
          </li>
        </ul>

        <div v-else class="notif-bell__empty">
          <span class="material-symbols-outlined" aria-hidden="true">notifications_none</span>
          <span>No notifications yet</span>
        </div>

        <NuxtLink to="/notifications" class="notif-bell__see-all" @click="open = false">
          See all notifications
          <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notif-bell {
  position: relative;
}

.notif-bell__btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  position: relative;
  transition:
    color 180ms ease,
    background 180ms ease;
}

.notif-bell__btn:hover {
  color: var(--color-primary);
  background: var(--color-surface-container-low);
}

.notif-bell__btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.notif-bell__badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.55rem;
  font-weight: 700;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 0.2rem;
  line-height: 1;
}

/* Dropdown */
.notif-bell__dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  width: 22rem;
  max-width: calc(100vw - 2rem);
  background: color-mix(in srgb, var(--color-surface-container-lowest) 90%, transparent);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 40px color-mix(in srgb, var(--color-on-surface) 10%, transparent);
  overflow: hidden;
  z-index: 200;
}

.notif-bell__drop-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
}

.notif-bell__drop-title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-on-surface);
}

.notif-bell__mark-all {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary);
  padding: 0;
  transition: opacity var(--transition-fast);
}

.notif-bell__mark-all:hover {
  opacity: 0.75;
}

.notif-bell__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  max-height: 20rem;
  overflow-y: auto;
  scrollbar-width: thin;
}

.notif-bell__item {
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  position: relative;
  transition: background var(--transition-fast);
}

.notif-bell__item:hover {
  background: var(--color-surface-container-low);
}

.notif-bell__item--unread {
  background: color-mix(in srgb, var(--color-primary-fixed) 40%, transparent);
}

.notif-bell__item--unread:hover {
  background: color-mix(in srgb, var(--color-primary-fixed) 60%, transparent);
}

.notif-bell__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-DEFAULT);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  flex-shrink: 0;
}

.notif-bell__item-icon .material-symbols-outlined {
  font-size: 1rem;
}

.notif-bell__item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.notif-bell__item-title {
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notif-bell__item-msg {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--color-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-bell__item-time {
  font-family: var(--font-label);
  font-size: 0.65rem;
  color: var(--color-secondary);
  margin-top: 0.125rem;
}

.notif-bell__unread-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  flex-shrink: 0;
  margin-top: 0.375rem;
}

.notif-bell__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-secondary);
}

.notif-bell__empty .material-symbols-outlined {
  font-size: 2rem;
  opacity: 0.4;
}

.notif-bell__see-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.875rem;
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  border-top: 1px solid color-mix(in srgb, var(--color-outline-variant) 15%, transparent);
  transition: background var(--transition-fast);
}

.notif-bell__see-all:hover {
  background: var(--color-surface-container-low);
}

.notif-bell__see-all .material-symbols-outlined {
  font-size: 0.875rem;
}

/* Dropdown transition */
.notif-drop-enter-active,
.notif-drop-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.notif-drop-enter-from,
.notif-drop-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
