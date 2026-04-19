import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useCategories } from '~/composables/useCategories'

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockCategory = { id: 'cat-1', name: 'Electronics', slug: 'electronics' }

describe('useCategories', () => {
  beforeEach(() => {
    mockUseFetch.mockReturnValue({ data: ref([mockCategory]), error: ref(null), pending: ref(false) })
    vi.clearAllMocks()
  })

  it('listCategories calls useFetch with /categories', () => {
    useCategories().listCategories()
    expect(mockUseFetch.mock.calls[0][0]).toBe('/categories')
  })

  it('listCategories passes pagination params', () => {
    useCategories().listCategories({ page: 1, limit: 20 })
    expect(mockUseFetch.mock.calls[0][1]).toMatchObject({ query: { page: 1, limit: 20 } })
  })

  it('categoryIcon returns correct icon for known slugs', () => {
    const { categoryIcon } = useCategories()
    expect(categoryIcon('electronics')).toBe('laptop_mac')
    expect(categoryIcon('home')).toBe('home')
    expect(categoryIcon('fashion')).toBe('checkroom')
  })

  it('categoryIcon returns "category" for unknown slug', () => {
    const { categoryIcon } = useCategories()
    expect(categoryIcon('unknown')).toBe('category')
  })

  it('categoryIcon maps all common slugs', () => {
    const { categoryIcon } = useCategories()
    const known = ['electronics', 'home', 'fashion', 'industrial', 'books', 'sports', 'toys', 'health']
    for (const slug of known) {
      expect(categoryIcon(slug)).not.toBe('category')
    }
  })
})
