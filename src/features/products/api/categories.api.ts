import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { ProductCategory } from '../types/product.types'

export const categoriesApi = {
  getCategories: async (): Promise<ProductCategory[]> => {
    const response = await apiClient.get<any[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES)
    const rawData = response.data

    if (!Array.isArray(rawData)) return []

    return rawData.map((item) => {
      if (typeof item === 'string') {
        return {
          slug: item,
          name: item.charAt(0).toUpperCase() + item.slice(1).replace('-', ' '),
          url: `/products/category/${item}`,
        }
      }
      return {
        slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name || item.slug,
        url: item.url || `/products/category/${item.slug}`,
      }
    })
  },
}
