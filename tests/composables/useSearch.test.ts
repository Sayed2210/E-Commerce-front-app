import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useSearch } from '~/composables/useSearch'

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

describe('useSearch', () => {
  beforeEach(() => {
    mockUseFetch.mockReturnValue({ data: ref(null), error: ref(null), pending: ref(false) })
    vi.clearAllMocks()
  })

  it('calls useFetch with q param', () => {
    useSearch().search('table lamp')
    const url = mockUseFetch.mock.calls[0][0] as string
    expect(url).toContain('q=table+lamp')
  })

  it('appends page param when provided', () => {
    useSearch().search('desk', { page: 3 })
    const url = mockUseFetch.mock.calls[0][0] as string
    expect(url).toContain('page=3')
  })

  it('appends limit param when provided', () => {
    useSearch().search('chair', { limit: 6 })
    const url = mockUseFetch.mock.calls[0][0] as string
    expect(url).toContain('limit=6')
  })

  it('appends category param when provided', () => {
    useSearch().search('lamp', { category: 'lighting' })
    const url = mockUseFetch.mock.calls[0][0] as string
    expect(url).toContain('category=lighting')
  })

  it('does not include page when not provided', () => {
    useSearch().search('rug')
    const url = mockUseFetch.mock.calls[0][0] as string
    expect(url).not.toContain('page=')
  })

  it('encodes special characters in query', () => {
    useSearch().search('modern & clean')
    const url = mockUseFetch.mock.calls[0][0] as string
    expect(url).toContain('q=')
    expect(url).not.toContain('q=modern & clean')
  })
})
