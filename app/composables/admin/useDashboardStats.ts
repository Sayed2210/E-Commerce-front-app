import type { Order } from '~/types/api'

interface KPICard {
  label: string
  value: string
  icon: string
  iconBg: string
  iconColor: string
  trend: number | null
}

interface OrderStatusItem {
  status: string
  count: number
  color: string
}

export async function useDashboardStats() {
  const { getDashboardStats } = useAdmin()
  const { data, pending } = await getDashboardStats()

  const stats = computed(() => (data.value as any) ?? null)

  // Transform stats into KPI cards
  const kpis = computed<KPICard[]>(() => [
    {
      label: 'Total Revenue',
      value: stats.value ? `$${Number(stats.value.totalRevenue ?? 0).toLocaleString()}` : '—',
      icon: 'payments',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: 12.5,
    },
    {
      label: 'Total Orders',
      value: stats.value ? Number(stats.value.totalOrders ?? 0).toLocaleString() : '—',
      icon: 'shopping_cart',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: 8.1,
    },
    {
      label: 'Customers',
      value: stats.value ? Number(stats.value.totalUsers ?? 0).toLocaleString() : '—',
      icon: 'group',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: 3.2,
    },
    {
      label: 'Products',
      value: stats.value ? Number(stats.value.totalProducts ?? 0).toLocaleString() : '—',
      icon: 'inventory_2',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: null,
    },
  ])

  // Recent orders data
  const recentOrders = computed<Order[]>(() => stats.value?.recentOrders ?? [])

  // Order status breakdown with colors
  const orderStatuses = computed<OrderStatusItem[]>(() => {
    const byStatus = stats.value?.ordersByStatus ?? []
    const colorMap: Record<string, string> = {
      pending: 'bg-secondary',
      confirmed: 'bg-blue-400',
      processing: 'bg-primary-container',
      shipped: 'bg-purple-400',
      delivered: 'bg-green-500',
      cancelled: 'bg-error',
    }

    if (byStatus.length) {
      return byStatus.map((s: any) => ({
        status: s.status,
        count: s.count,
        color: colorMap[s.status] ?? 'bg-secondary',
      }))
    }

    return Object.entries(colorMap).map(([status, color]) => ({
      status,
      count: 0,
      color,
    }))
  })

  // Status CSS class mapping
  function getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      pending: 'bg-surface-container text-secondary',
      confirmed: 'bg-secondary-container text-on-surface',
      processing: 'bg-primary-fixed text-on-primary-fixed-variant',
      shipped: 'bg-secondary-container text-on-secondary-fixed-variant',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-error-container text-on-error-container',
    }
    return classMap[status] ?? 'bg-surface-container text-secondary'
  }

  // Format date helper
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return {
    stats,
    kpis,
    recentOrders,
    orderStatuses,
    pending,
    getStatusClass,
    formatDate,
  }
}
