import type { Category } from '~/types/api'

/** Map common category slugs to Material Symbols icon names. */
const SLUG_ICON_MAP: Record<string, string> = {
  electronics: 'laptop_mac',
  home: 'home',
  fashion: 'checkroom',
  industrial: 'construction',
  books: 'auto_stories',
  sports: 'fitness_center',
  toys: 'toys',
  health: 'local_pharmacy',
  beauty: 'spa',
  food: 'restaurant',
  automotive: 'directions_car',
  garden: 'yard',
  music: 'music_note',
  movies: 'movie',
  gaming: 'sports_esports',
  office: 'business_center',
  pets: 'pets',
  baby: 'child_care',
}

export function useCategories() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  function listCategories(params?: { page?: number; limit?: number }) {
    const query: Record<string, number> = {}
    if (params?.page) query.page = params.page
    if (params?.limit) query.limit = params.limit
    return useFetch<Category[]>('/categories', { baseURL, query })
  }

  /** Return the icon name for a category slug, with a sensible fallback. */
  function categoryIcon(slug: string): string {
    return SLUG_ICON_MAP[slug] ?? 'category'
  }

  return { listCategories, categoryIcon }
}
