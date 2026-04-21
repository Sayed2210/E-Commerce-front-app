import { getAccessToken } from '~/utils/token'
import type { Address, CreateAddressDto, UpdateAddressDto } from '~/types/api'

function authH(): Record<string, string> {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// - GET /users/me/addresses
//   - POST /users/me/addresses
//   - PATCH /users/me/addresses/:id
//   - PATCH /users/me/addresses/:id/default
//   - DELETE /users/me/addresses/:id
export function useAddresses() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function getAddresses() {
    return useFetch<Address[]>('/users/me/addresses', { baseURL, headers: authH() })
  }

  async function createAddress(dto: CreateAddressDto) {
    try {
      const data = await $fetch<Address>(`${baseURL}/users/me/addresses`, {
        method: 'POST',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function updateAddress(id: string, dto: UpdateAddressDto) {
    try {
      const data = await $fetch<Address>(`${baseURL}/users/me/addresses/${id}`, {
        method: 'PATCH',
        body: dto,
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function setDefault(id: string) {
    try {
      const data = await $fetch<Address>(`${baseURL}/users/me/addresses/${id}/default`, {
        method: 'PATCH',
        headers: authH(),
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  async function deleteAddress(id: string) {
    try {
      await $fetch(`${baseURL}/users/me/addresses/${id}`, { method: 'DELETE', headers: authH() })
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { getAddresses, createAddress, updateAddress, setDefault, deleteAddress }
}
