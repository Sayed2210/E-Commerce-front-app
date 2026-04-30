import type { Currency } from '~/types/api'

const CURRENCY_COOKIE = 'selected_currency'

export function useCurrency() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  const selectedCurrency = useCookie<string>(CURRENCY_COOKIE, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    default: () => '',
  })

  const { data: currenciesData } = useFetch<Currency[]>('/currencies', {
    baseURL,
    key: 'currencies-list',
    default: () => [],
  })

  const currencies = computed<Currency[]>(() => currenciesData.value ?? [])

  const activeCurrencies = computed(() => currencies.value.filter((c) => c.isActive))

  const defaultCurrency = computed(
    () => currencies.value.find((c) => c.isDefault) ?? currencies.value[0]
  )

  const currentCurrency = computed<Currency>(() => {
    if (selectedCurrency.value) {
      const found = currencies.value.find((c) => c.code === selectedCurrency.value)
      if (found && found.isActive) return found
    }
    return (
      defaultCurrency.value ?? {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        exchangeRate: 1,
        isActive: true,
        isDefault: true,
      }
    )
  })

  function setCurrency(code: string) {
    const found = currencies.value.find((c) => c.code === code)
    if (found && found.isActive) {
      selectedCurrency.value = code
    }
  }

  function convert(price: number): number {
    if (!currentCurrency.value) return price
    return price * currentCurrency.value.exchangeRate
  }

  function format(price: number, options?: { decimals?: number }): string {
    const currency = currentCurrency.value
    const converted = convert(price)
    const decimals = options?.decimals ?? 2
    return `${currency.symbol}${converted.toFixed(decimals)}`
  }

  function formatRaw(price: number, options?: { decimals?: number }): string {
    const currency = currentCurrency.value
    const decimals = options?.decimals ?? 2
    return `${currency.symbol}${price.toFixed(decimals)}`
  }

  return {
    currencies,
    activeCurrencies,
    defaultCurrency,
    currentCurrency,
    selectedCurrency,
    setCurrency,
    convert,
    format,
    formatRaw,
  }
}
