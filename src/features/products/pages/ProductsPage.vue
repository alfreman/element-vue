<template>
  <div class="space-y-6">
    <!-- Header Block -->
    <AppPageHeader
      title="Productos"
      description="Administra el catálogo de productos de la plataforma ERP/POS"
    >
      <template #icon>
        <Package class="w-6 h-6 text-brand-600" />
      </template>
      <template #actions>
        <el-button type="primary" size="large" @click="handleOpenCreateDrawer">
          <template #icon>
            <Plus class="w-4 h-4" />
          </template>
          Nuevo producto
        </el-button>
      </template>
    </AppPageHeader>

    <!-- Filters Block -->
    <ProductFiltersPanel
      v-model:filters="filters"
      :categories="categories || []"
      :is-categories-loading="isCategoriesLoading"
      @reset="handleResetFilters"
    />

    <!-- TanStack Table Block -->
    <ProductTable
      :data="productsData?.products || []"
      :total="productsData?.total || 0"
      :page="filters.page"
      :page-size="filters.pageSize"
      :is-loading="isLoading"
      :is-error="isError"
      :error-message="error?.message"
      @update:page="handlePageChange"
      @update:pageSize="handlePageSizeChange"
      @view="handleViewProduct"
      @edit="handleEditProduct"
      @delete="handleDeleteProduct"
      @retry="refetch"
      @reset-filters="handleResetFilters"
    />

    <!-- Form Drawer (Create / Edit / View) -->
    <ProductFormDrawer
      v-model="isDrawerOpen"
      :product="selectedProduct"
      :categories="categories || []"
      :is-submitting="createMutation.isPending.value || updateMutation.isPending.value"
      :is-read-only="isDrawerReadOnly"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Package, Plus } from 'lucide-vue-next'
import type { Product, ProductFilters, ProductFormValues } from '../types/product.types'
import {
  useProductsQuery,
  useCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../composables/useProducts'
import {
  mapFormToCreatePayload,
  mapFormToUpdatePayload,
} from '../utils/product.utils'

import AppPageHeader from '@/components/common/AppPageHeader.vue'
import ProductFiltersPanel from '../components/ProductFilters.vue'
import ProductTable from '../components/ProductTable.vue'
import ProductFormDrawer from '../components/ProductFormDrawer.vue'

// Filters state
const filters = ref<ProductFilters>({
  search: '',
  category: 'all',
  status: 'all',
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  inStockOnly: false,
  isActive: true,
  page: 1,
  pageSize: 10,
})

// Query & Mutation Composables
const { data: productsData, isLoading, isError, error, refetch } = useProductsQuery(filters)
const { data: categories, isLoading: isCategoriesLoading } = useCategoriesQuery()

const createMutation = useCreateProductMutation()
const updateMutation = useUpdateProductMutation()
const deleteMutation = useDeleteProductMutation()

// Drawer State
const isDrawerOpen = ref<boolean>(false)
const selectedProduct = ref<Product | null>(null)
const isDrawerReadOnly = ref<boolean>(false)

const handleOpenCreateDrawer = (): void => {
  selectedProduct.value = null
  isDrawerReadOnly.value = false
  isDrawerOpen.value = true
}

const handleViewProduct = (product: Product): void => {
  selectedProduct.value = product
  isDrawerReadOnly.value = true
  isDrawerOpen.value = true
}

const handleEditProduct = (product: Product): void => {
  selectedProduct.value = product
  isDrawerReadOnly.value = false
  isDrawerOpen.value = true
}

const handleDeleteProduct = (productId: number): void => {
  deleteMutation.mutate(productId)
}

const handleFormSubmit = (formValues: ProductFormValues): void => {
  if (selectedProduct.value && selectedProduct.value.id) {
    // UPDATE MODE
    const payload = mapFormToUpdatePayload(formValues)
    updateMutation.mutate(
      { id: selectedProduct.value.id, payload },
      {
        onSuccess: () => {
          isDrawerOpen.value = false
        },
      }
    )
  } else {
    // CREATE MODE
    const payload = mapFormToCreatePayload(formValues)
    createMutation.mutate(payload, {
      onSuccess: () => {
        isDrawerOpen.value = false
      },
    })
  }
}

const handlePageChange = (newPage: number): void => {
  filters.value.page = newPage
}

const handlePageSizeChange = (newSize: number): void => {
  filters.value.pageSize = newSize
  filters.value.page = 1
}

const handleResetFilters = (): void => {
  filters.value = {
    search: '',
    category: 'all',
    status: 'all',
    minPrice: 0,
    maxPrice: 2000,
    minRating: 0,
    inStockOnly: false,
    isActive: true,
    page: 1,
    pageSize: 10,
  }
}
</script>
