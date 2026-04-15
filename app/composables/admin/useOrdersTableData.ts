import type { Order } from '~/types/api'

export async function useOrdersTableData() {
  const { listOrders, updateOrderStatus: apiUpdateStatus } = useOrders()

  // State
  const search = ref('')
  const statusFilter = ref('')
  const currentPage = ref(1)

  // Available statuses
  const statuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]

  // Fetch orders
  const { data, pending, refresh } = await listOrders({
    page: currentPage.value,
    limit: 20,
  })

  // Watch for page changes
  watch(currentPage, () => refresh())

  // Extract orders from response
  const orders = computed<Order[]>(() => (data.value as any)?.data ?? (data.value as any) ?? [])

  // Total count
  const total = computed<number>(() => (data.value as any)?.total ?? orders.value.length)

  // Total pages
  const totalPages = computed<number>(() => (data.value as any)?.totalPages ?? 1)

  // Filtered orders
  const filteredOrders = computed<Order[]>(() =>
    orders.value.filter((o) => {
      const matchSearch =
        !search.value || o.id.includes(search.value) || o.user?.email?.includes(search.value)
      const matchStatus = !statusFilter.value || o.status === statusFilter.value
      return matchSearch && matchStatus
    })
  )

  // Update order status
  async function updateStatus(id: string, status: string): Promise<void> {
    await apiUpdateStatus(id, status)
    await refresh()
  }

  // Get CSS class for status badge
  function getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      pending: 'bg-surface-container text-secondary',
      confirmed: 'bg-secondary-container text-on-surface',
      processing: 'bg-orange-100 text-orange-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-error-container text-on-error-container',
      refunded: 'bg-surface-container text-secondary',
    }
    return classMap[status] ?? 'bg-surface-container text-secondary'
  }

  // Format date helper
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return {
    // State
    search,
    statusFilter,
    currentPage,
    statuses,

    // Data
    orders,
    filteredOrders,
    total,
    totalPages,
    pending,

    // Methods
    updateStatus,
    getStatusClass,
    formatDate,
    refresh,
  }
}
