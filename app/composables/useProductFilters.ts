export function useProductFilters() {
  const { t } = useI18n()
  const route = useRoute()

  const priceRanges = computed(() => [
    { label: t('products.under', { max: 25 }), value: '0-25' },
    { label: t('products.range', { min: 25, max: 100 }), value: '25-100' },
    { label: t('products.range', { min: 100, max: 500 }), value: '100-500' },
    { label: t('products.over', { min: 500 }), value: '500-99999' },
  ])

  const sortOptions = computed(() => [
    { label: t('products.mostRelevant'), value: '' },
    { label: t('products.priceLowToHigh'), value: 'price_asc' },
    { label: t('products.priceHighToLow'), value: 'price_desc' },
    { label: t('products.topRated'), value: 'rating' },
    { label: t('products.newest'), value: 'newest' },
  ])

  const selectedCategory = ref((route.query.category as string) ?? '')
  const selectedBrand = ref((route.query.brand as string) ?? '')
  const selectedPrice = ref('')
  const selectedSort = ref('')
  const currentPage = ref(1)
  const filterOpen = ref(false)

  const activeFiltersCount = computed(() => {
    let n = 0
    if (selectedCategory.value) n++
    if (selectedBrand.value) n++
    if (selectedPrice.value) n++
    return n
  })

  function toggleCategory(slug: string) {
    selectedCategory.value = selectedCategory.value === slug ? '' : slug
    currentPage.value = 1
  }

  function clearFilters() {
    selectedCategory.value = ''
    selectedBrand.value = ''
    selectedPrice.value = ''
    selectedSort.value = ''
    currentPage.value = 1
  }

  return {
    priceRanges,
    sortOptions,
    selectedCategory,
    selectedBrand,
    selectedPrice,
    selectedSort,
    currentPage,
    filterOpen,
    activeFiltersCount,
    toggleCategory,
    clearFilters,
  }
}
