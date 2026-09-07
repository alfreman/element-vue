import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { productsApi, type ProductsApiQueryParams } from '../api/products.api'
import { categoriesApi } from '../api/categories.api'
import type {
  ProductFilters,
  CreateProductPayload,
  UpdateProductPayload,
  ProductListResponse,
} from '../types/product.types'
import { ElMessage } from 'element-plus'

/**
 * Fetch paginated & filtered products with TanStack Query
 * Parameters (page, pageSize, skip, limit) and post-filtering are managed inside this hook.
 */
export const useProductsQuery = (filters: Ref<ProductFilters>) =>
  useQuery({
    queryKey: computed(() => [
      'products',
      {
        page: filters.value.page,
        pageSize: filters.value.pageSize,
        search: filters.value.search,
        category: filters.value.category,
        status: filters.value.status,
        minPrice: filters.value.minPrice,
        maxPrice: filters.value.maxPrice,
        minRating: filters.value.minRating,
        inStockOnly: filters.value.inStockOnly,
        sortBy: filters.value.sortBy,
        sortOrder: filters.value.sortOrder,
      },
    ]),
    queryFn: async (): Promise<ProductListResponse> => {
      const limit = filters.value.pageSize || 10
      const skip = Math.max(0, ((filters.value.page || 1) - 1) * limit)

      const params: ProductsApiQueryParams = {
        limit,
        skip,
        q: filters.value.search ? filters.value.search.trim() : undefined,
        category: filters.value.category !== 'all' ? filters.value.category : undefined,
        sortBy: filters.value.sortBy,
        order: filters.value.sortOrder,
      }

      try {
        const response = await productsApi.getProducts(params)
        let filteredProducts = response.products || []

        if (filters.value.minPrice !== undefined && filters.value.minPrice > 0) {
          filteredProducts = filteredProducts.filter((p) => p.price >= filters.value.minPrice!)
        }
        if (filters.value.maxPrice !== undefined && filters.value.maxPrice < 2000) {
          filteredProducts = filteredProducts.filter((p) => p.price <= filters.value.maxPrice!)
        }
        if (filters.value.minRating !== undefined && filters.value.minRating > 0) {
          filteredProducts = filteredProducts.filter(
            (p) => (p.rating || 0) >= filters.value.minRating!
          )
        }
        if (filters.value.inStockOnly) {
          filteredProducts = filteredProducts.filter((p) => p.stock > 0)
        }

        return {
          products: filteredProducts,
          total: response.total ?? filteredProducts.length,
          skip: response.skip ?? skip,
          limit: response.limit ?? limit,
        }
      } catch {
        return {
          products: [],
          total: 0,
          skip,
          limit,
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

/**
 * Fetch product details by ID
 */
export const useProductQuery = (productId: Ref<number | null>) =>
  useQuery({
    queryKey: computed(() => ['product', productId.value]),
    queryFn: () => productsApi.getProductById(productId.value!),
    enabled: computed(() => productId.value !== null && productId.value > 0),
  })

/**
 * Fetch available product categories
 */
export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

/**
 * Create product mutation
 */
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.createProduct(payload),
    onSuccess: (newProduct) => {
      ElMessage.success({
        message: `Producto "${newProduct.title}" registrado exitosamente`,
        duration: 4000,
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      ElMessage.error({
        message: error.message || 'Error al crear el producto',
        duration: 5000,
      })
    },
  })
}

/**
 * Update product mutation
 */
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      productsApi.updateProduct(id, payload),
    onSuccess: (updatedProduct) => {
      ElMessage.success({
        message: `Producto "${updatedProduct.title || 'actualizado'}" guardado correctamente`,
        duration: 4000,
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.id] })
    },
    onError: (error: any) => {
      ElMessage.error({
        message: error.message || 'Error al actualizar el producto',
        duration: 5000,
      })
    },
  })
}

/**
 * Delete product mutation
 */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: (_, id) => {
      ElMessage.success({
        message: `Producto #${id} eliminado correctamente`,
        duration: 4000,
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      ElMessage.error({
        message: error.message || 'Error al eliminar el producto',
        duration: 5000,
      })
    },
  })
}
