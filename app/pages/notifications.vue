<script setup lang="ts">
import { useNotificationsStore } from '~/stores/notifications'
import { showErrorToast, showSuccessToast } from '~/utils/errorHandler'

definePageMeta({ middleware: 'auth' })

const notificationsStore = useNotificationsStore()
const { listNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

const loading = ref(false)

onMounted(async () => {
  if (!notificationsStore.loaded) {
    loading.value = true
    const { data } = await listNotifications()
    if (data) notificationsStore.setAll(data)
    loading.value = false
  }
})

async function handleMarkRead(id: string) {
  notificationsStore.markRead(id)
  await markAsRead(id)
}

async function handleMarkAllRead() {
  notificationsStore.markAllRead()
  const { error } = await markAllAsRead()
  if (error) showErrorToast(error)
  else showSuccessToast('All notifications marked as read')
}

async function handleDelete(id: string) {
  const { error } = await deleteNotification(id)
  if (error) {
    showErrorToast(error)
    return
  }
  notificationsStore.remove(id)
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

const typeIcon: Record<string, string> = {
  order: 'shopping_bag',
  promo: 'local_offer',
  review: 'star',
  system: 'info',
}
</script>

<template>
  <div class="notif-page">
    <div class="notif-page__header">
      <div class="notif-page__title-row">
        <h1 class="notif-page__title">Notifications</h1>
        <span v-if="notificationsStore.unreadCount > 0" class="notif-page__badge">
          {{ notificationsStore.unreadCount }} unread
        </span>
      </div>
      <button
        v-if="notificationsStore.unreadCount > 0"
        type="button"
        class="notif-page__mark-all"
        @click="handleMarkAllRead"
      >
        <span class="material-symbols-outlined" aria-hidden="true">done_all</span>
        Mark all as read
      </button>
    </div>

    <div v-if="loading" class="notif-page__loading">
      <span class="material-symbols-outlined notif-page__spin" aria-hidden="true">refresh</span>
    </div>

    <div v-else-if="!notificationsStore.items.length" class="notif-page__empty">
      <span class="material-symbols-outlined" aria-hidden="true">notifications_none</span>
      <p>You're all caught up!</p>
      <span class="notif-page__empty-sub">No notifications yet</span>
    </div>

    <ul v-else class="notif-page__list" role="list">
      <li
        v-for="n in notificationsStore.items"
        :key="n.id"
        class="notif-page__item"
        :class="{ 'notif-page__item--unread': !n.isRead }"
        @click="!n.isRead && handleMarkRead(n.id)"
      >
        <div class="notif-page__item-icon">
          <span class="material-symbols-outlined" aria-hidden="true">{{
            typeIcon[n.type] ?? 'info'
          }}</span>
        </div>
        <div class="notif-page__item-body">
          <div class="notif-page__item-top">
            <span class="notif-page__item-title">{{ n.title }}</span>
            <span class="notif-page__item-time">{{ timeAgo(n.createdAt) }}</span>
          </div>
          <p class="notif-page__item-msg">{{ n.message }}</p>
        </div>
        <div class="notif-page__item-actions">
          <span v-if="!n.isRead" class="notif-page__unread-dot" aria-label="Unread" />
          <button
            type="button"
            class="notif-page__delete-btn"
            aria-label="Delete notification"
            @click.stop="handleDelete(n.id)"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.notif-page {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

.notif-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.notif-page__title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notif-page__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-on-surface);
  margin: 0;
}

.notif-page__badge {
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
}

.notif-page__mark-all {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-primary);
  transition: opacity var(--transition-fast);
}

.notif-page__mark-all:hover {
  opacity: 0.75;
}

.notif-page__mark-all .material-symbols-outlined {
  font-size: 1rem;
}

.notif-page__loading {
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: var(--color-secondary);
}

.notif-page__spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.notif-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 5rem 1.25rem;
  color: var(--color-secondary);
  text-align: center;
}

.notif-page__empty .material-symbols-outlined {
  font-size: 3rem;
  opacity: 0.35;
}

.notif-page__empty p {
  font-family: var(--font-headline);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.notif-page__empty-sub {
  font-family: var(--font-body);
  font-size: 0.875rem;
}

.notif-page__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notif-page__item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  cursor: pointer;
  transition: background var(--transition-fast);
  position: relative;
}

.notif-page__item:hover {
  background: var(--color-surface-container-low);
}

.notif-page__item--unread {
  background: color-mix(in srgb, var(--color-primary-fixed) 35%, transparent);
}

.notif-page__item--unread:hover {
  background: color-mix(in srgb, var(--color-primary-fixed) 55%, transparent);
}

.notif-page__item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-DEFAULT);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  flex-shrink: 0;
}

.notif-page__item-icon .material-symbols-outlined {
  font-size: 1.25rem;
}

.notif-page__item-body {
  flex: 1;
  min-width: 0;
}

.notif-page__item-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.notif-page__item-title {
  font-family: var(--font-label);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-on-surface);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notif-page__item-time {
  font-family: var(--font-label);
  font-size: 0.7rem;
  color: var(--color-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.notif-page__item-msg {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-secondary);
  line-height: 1.5;
  margin: 0;
}

.notif-page__item-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.notif-page__unread-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background: var(--color-primary);
}

.notif-page__delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-full);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-secondary);
  opacity: 0;
  transition:
    opacity var(--transition-fast),
    background var(--transition-fast),
    color var(--transition-fast);
}

.notif-page__item:hover .notif-page__delete-btn {
  opacity: 1;
}

.notif-page__delete-btn:hover {
  background: var(--color-error-container);
  color: var(--color-error);
}

.notif-page__delete-btn .material-symbols-outlined {
  font-size: 1rem;
}
</style>
