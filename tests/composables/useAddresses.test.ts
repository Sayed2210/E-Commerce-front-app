import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useAddresses } from '~/composables/useAddresses'

vi.mock('~/utils/token', () => ({ getAccessToken: vi.fn(() => 'mock-token') }))

const { mockUseFetch } = vi.hoisted(() => ({ mockUseFetch: vi.fn() }))
mockNuxtImport('useFetch', () => mockUseFetch)
mockNuxtImport('useRuntimeConfig', () => vi.fn(() => ({ public: { apiBaseUrl: 'http://api.test' } })))

const mockAddress = { id: 'addr-1', userId: 'user-1', street: '123 Main St', city: 'Springfield', state: 'IL', postalCode: '62701', country: 'US', isDefault: false }
const mockDto = { street: 'A', city: 'B', state: 'C', postalCode: '0', country: 'US', isDefault: false }

describe('useAddresses', () => {
  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn())
    mockUseFetch.mockReturnValue({ data: ref([mockAddress]), error: ref(null) })
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks() })

  it('getAddresses calls useFetch with /addresses', () => {
    useAddresses().getAddresses()
    expect(mockUseFetch.mock.calls[0][0]).toBe('/addresses')
  })

  it('getAddresses includes auth header', () => {
    useAddresses().getAddresses()
    expect(mockUseFetch.mock.calls[0][1]).toMatchObject({ headers: { Authorization: 'Bearer mock-token' } })
  })

  it('createAddress calls POST /addresses', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockAddress)
    await useAddresses().createAddress(mockDto)
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/addresses'), expect.objectContaining({ method: 'POST' }))
  })

  it('createAddress returns data on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockAddress)
    const result = await useAddresses().createAddress(mockDto)
    expect(result.data).toEqual(mockAddress)
    expect(result.error).toBeNull()
  })

  it('createAddress returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Validation failed'))
    const result = await useAddresses().createAddress(mockDto)
    expect(result.data).toBeNull()
    expect(result.error).toBeDefined()
  })

  it('updateAddress calls PATCH /addresses/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockAddress)
    await useAddresses().updateAddress('addr-1', { city: 'Chicago' })
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/addresses/addr-1'), expect.objectContaining({ method: 'PATCH', body: { city: 'Chicago' } }))
  })

  it('updateAddress returns data on success', async () => {
    const updated = { ...mockAddress, city: 'Chicago' }
    vi.mocked($fetch).mockResolvedValueOnce(updated)
    const result = await useAddresses().updateAddress('addr-1', { city: 'Chicago' })
    expect(result.data).toEqual(updated)
    expect(result.error).toBeNull()
  })

  it('setDefault calls PATCH /addresses/:id/default', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(mockAddress)
    await useAddresses().setDefault('addr-1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/addresses/addr-1/default'), expect.objectContaining({ method: 'PATCH' }))
  })

  it('deleteAddress calls DELETE /addresses/:id', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    await useAddresses().deleteAddress('addr-1')
    expect($fetch).toHaveBeenCalledWith(expect.stringContaining('/addresses/addr-1'), expect.objectContaining({ method: 'DELETE' }))
  })

  it('deleteAddress returns no error on success', async () => {
    vi.mocked($fetch).mockResolvedValueOnce(undefined)
    const result = await useAddresses().deleteAddress('addr-1')
    expect(result.error).toBeNull()
  })

  it('deleteAddress returns error on failure', async () => {
    vi.mocked($fetch).mockRejectedValueOnce(new Error('Not found'))
    const result = await useAddresses().deleteAddress('addr-1')
    expect(result.error).toBeDefined()
  })
})
