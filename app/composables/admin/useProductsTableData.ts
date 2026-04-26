import type { Product } from '~/types/api'

export async function useProductsTableData() {
  const { listProducts, deleteProduct: apiDelete } = useProducts()

  // State
  const search = ref('')
  const statusFilter = ref('')
  const currentPage = ref(1)

  // Fetch products
  const { data, pending, refresh } = await listProducts({
    page: currentPage.value,
    limit: 20,
  })

  // Watch for page changes
  watch(currentPage, () => refresh())

  // Extract products from response
  const products = computed<Product[]>(() => (data.value as any)?.data ?? (data.value as any) ?? [])

  // Total count
  const total = computed<number>(() => (data.value as any)?.total ?? products.value.length)

  // Total pages
  const totalPages = computed<number>(() => (data.value as any)?.totalPages ?? 1)

  // Filtered products
  const filteredProducts = computed<Product[]>(() =>
    products.value.filter((p) => {
      const name = getProductName(p).toLowerCase()
      const matchSearch = !search.value || name.includes(search.value.toLowerCase())
      const matchStatus =
        !statusFilter.value || (statusFilter.value === 'active' ? p.isActive : !p.isActive)
      return matchSearch && matchStatus
    })
  )

  // Helper: get product name (handle i18n)
  function getProductName(product: Product): string {
    return typeof product.name === 'string' ? product.name : (product.name?.en ?? '')
  }

  // Delete product with confirmation
  async function deleteProduct(id: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this product?')) return
    await apiDelete(id)
    await refresh()
  }

  return {
    // State
    search,
    statusFilter,
    currentPage,

    // Data
    products,
    filteredProducts,
    total,
    totalPages,
    pending,

    // Methods
    deleteProduct,
    getProductName,
    refresh,
  }
}
