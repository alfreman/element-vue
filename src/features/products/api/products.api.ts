import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import type {
  Product,
  ProductFilters,
  ProductListResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types/product.types'

export const productsApi = {
  getProducts: async (filters: ProductFilters): Promise<ProductListResponse> => {
    const limit = filters.pageSize || 10
    const skip = (filters.page - 1) * limit

    let url = API_ENDPOINTS.PRODUCTS.LIST
    const params: Record<string, any> = { limit, skip }

    if (filters.search && filters.search.trim() !== '') {
      url = API_ENDPOINTS.PRODUCTS.SEARCH
      params.q = filters.search.trim()
    } else if (filters.category && filters.category !== 'all') {
      url = `/products/category/${encodeURIComponent(filters.category)}`
    }

    if (filters.sortBy) {
      params.sortBy = filters.sortBy
      params.order = filters.sortOrder || 'asc'
    }

    try {
      const response = await apiClient.get<ProductListResponse>(url, { params })
      const data = response.data

      let filteredList = data.products

      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        filteredList = filteredList.filter((p) => p.price >= filters.minPrice!)
      }
      if (filters.maxPrice !== undefined && filters.maxPrice < 2000) {
        filteredList = filteredList.filter((p) => p.price <= filters.maxPrice!)
      }
      if (filters.minRating !== undefined && filters.minRating > 0) {
        filteredList = filteredList.filter((p) => p.rating >= filters.minRating!)
      }
      if (filters.inStockOnly) {
        filteredList = filteredList.filter((p) => p.stock > 0)
      }

      return {
        products: filteredList,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      }
    } catch {
      return { products: [], total: 0, skip: 0, limit }
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id))
    return response.data
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    try {
      const response = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.ADD, payload)
      return {
        ...response.data,
        ...payload,
        id: response.data.id || Math.floor(200 + Math.random() * 800),
      }
    } catch {
      return {
        id: Math.floor(200 + Math.random() * 800),
        title: payload.title,
        description: payload.description,
        category: payload.category,
        price: payload.price,
        discountPercentage: payload.discountPercentage || 0,
        rating: payload.rating || 4.5,
        stock: payload.stock,
        brand: payload.brand || 'Marca Genérica',
        sku: payload.sku || `SKU-${Date.now()}`,
        weight: payload.weight || 0.5,
        dimensions: payload.dimensions || { width: 10, height: 15, depth: 5 },
        warrantyInformation: payload.warrantyInformation || '1 año',
        shippingInformation: payload.shippingInformation || 'Envío estándar',
        availabilityStatus: payload.availabilityStatus || 'Activo',
        returnPolicy: payload.returnPolicy || '30 días',
        minimumOrderQuantity: payload.minimumOrderQuantity || 1,
        images: payload.images.length > 0 ? payload.images : ['https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png'],
        thumbnail: payload.thumbnail || payload.images[0] || 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
      }
    }
  },

  updateProduct: async (id: number, payload: UpdateProductPayload): Promise<Product> => {
    try {
      const response = await apiClient.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), payload)
      return {
        ...response.data,
        ...payload,
        id,
      }
    } catch {
      return {
        id,
        title: payload.title || 'Producto Actualizado',
        description: payload.description || '',
        category: payload.category || 'beauty',
        price: payload.price || 99.99,
        discountPercentage: payload.discountPercentage || 0,
        rating: payload.rating || 4.5,
        stock: payload.stock || 10,
        brand: payload.brand || 'Marca Genérica',
        sku: payload.sku || `SKU-${id}`,
        images: payload.images || [],
        thumbnail: payload.thumbnail || '',
        ...payload,
      } as Product
    }
  },

  deleteProduct: async (id: number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id))
      return response.data
    } catch {
      return { id, isDeleted: true, deletedOn: new Date().toISOString() }
    }
  },
}
