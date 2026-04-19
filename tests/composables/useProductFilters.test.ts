import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { PRICE_RANGES, SORT_OPTIONS, useProductFilters } from '~/composables/useProductFilters'

const { mockUseRoute } = vi.hoisted(() => ({ mockUseRoute: vi.fn() }))
mockNuxtImport('useRoute', () => mockUseRoute)

describe('PRICE_RANGES', () => {
  it('exports four price range options', () => {
    expect(PRICE_RANGES).toHaveLength(4)
  })

  it('first range is under $25', () => {
    expect(PRICE_RANGES[0].label).toBe('Under $25')
    expect(PRICE_RANGES[0].value).toBe('0-25')
  })

  it('last range is over $500', () => {
    expect(PRICE_RANGES[3].label).toBe('Over $500')
    expect(PRICE_RANGES[3].value).toBe('500-99999')
  })
})

describe('SORT_OPTIONS', () => {
  it('exports five sort options', () => {
    expect(SORT_OPTIONS).toHaveLength(5)
  })

  it('first option is most relevant with empty value', () => {
    expect(SORT_OPTIONS[0].label).toBe('Most Relevant')
    expect(SORT_OPTIONS[0].value).toBe('')
  })

  it('includes price ascending and descending', () => {
    const values = SORT_OPTIONS.map((o) => o.value)
    expect(values).toContain('price_asc')
    expect(values).toContain('price_desc')
  })
})

describe('useProductFilters', () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ query: {} })
    vi.clearAllMocks()
  })

  it('initializes with empty filters', () => {
    const { selectedCategory, selectedPrice, selectedSort, currentPage } = useProductFilters()
    expect(selectedCategory.value).toBe('')
    expect(selectedPrice.value).toBe('')
    expect(selectedSort.value).toBe('')
    expect(currentPage.value).toBe(1)
  })

  it('filterOpen starts false', () => {
    const { filterOpen } = useProductFilters()
    expect(filterOpen.value).toBe(false)
  })

  it('activeFiltersCount is 0 with no filters', () => {
    const { activeFiltersCount } = useProductFilters()
    expect(activeFiltersCount.value).toBe(0)
  })

  it('activeFiltersCount increments when category is selected', () => {
    const { selectedCategory, activeFiltersCount } = useProductFilters()
    selectedCategory.value = 'electronics'
    expect(activeFiltersCount.value).toBe(1)
  })

  it('activeFiltersCount increments when price range is selected', () => {
    const { selectedPrice, activeFiltersCount } = useProductFilters()
    selectedPrice.value = '0-25'
    expect(activeFiltersCount.value).toBe(1)
  })

  it('activeFiltersCount counts both category and price', () => {
    const { selectedCategory, selectedPrice, activeFiltersCount } = useProductFilters()
    selectedCategory.value = 'books'
    selectedPrice.value = '25-100'
    expect(activeFiltersCount.value).toBe(2)
  })

  it('clearFilters resets category, price, sort, and page', () => {
    const { selectedCategory, selectedPrice, selectedSort, currentPage, clearFilters } = useProductFilters()
    selectedCategory.value = 'electronics'
    selectedPrice.value = '0-25'
    selectedSort.value = 'price_asc'
    currentPage.value = 3
    clearFilters()
    expect(selectedCategory.value).toBe('')
    expect(selectedPrice.value).toBe('')
    expect(selectedSort.value).toBe('')
    expect(currentPage.value).toBe(1)
  })

  it('reads category from route query on init', () => {
    mockUseRoute.mockReturnValueOnce({ query: { category: 'fashion' } })
    const { selectedCategory } = useProductFilters()
    expect(selectedCategory.value).toBe('fashion')
  })
})
