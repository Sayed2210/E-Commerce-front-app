export const PRICE_RANGES = [
  { label: 'Under $25', value: '0-25' },
  { label: '$25 – $100', value: '25-100' },
  { label: '$100 – $500', value: '100-500' },
  { label: 'Over $500', value: '500-99999' },
] as const

export const SORT_OPTIONS = [
  { label: 'Most Relevant', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
] as const

export function useProductFilters() {
  const route = useRoute()

  const selectedCategory = ref((route.query.category as string) ?? '')
  const selectedPrice = ref('')
  const selectedSort = ref('')
  const currentPage = ref(1)
  const filterOpen = ref(false)

  const activeFiltersCount = computed(() => {
    let n = 0
    if (selectedCategory.value) n++
    if (selectedPrice.value) n++
    return n
  })

  function toggleCategory(slug: string) {
    selectedCategory.value = selectedCategory.value === slug ? '' : slug
    currentPage.value = 1
  }

  function clearFilters() {
    selectedCategory.value = ''
    selectedPrice.value = ''
    selectedSort.value = ''
    currentPage.value = 1
  }

  return {
    selectedCategory,
    selectedPrice,
    selectedSort,
    currentPage,
    filterOpen,
    activeFiltersCount,
    toggleCategory,
    clearFilters,
  }
}
