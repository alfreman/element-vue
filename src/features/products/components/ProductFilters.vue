<template>
  <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 transition-all duration-200">
    <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
      <div class="flex items-center gap-2 text-gray-800 font-semibold">
        <Filter class="w-4 h-4 text-brand-600" />
        <span>Filtros de Búsqueda</span>
      </div>
      <el-button link type="primary" size="small" @click="handleReset">
        <template #icon>
          <RotateCcw class="w-3.5 h-3.5" />
        </template>
        Limpiar Filtros
      </el-button>
    </div>

    <!-- Search Input & Quick Controls -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <!-- Search Input -->
      <div class="lg:col-span-2">
        <label class="block text-xs font-semibold text-gray-600 mb-1">Buscar producto</label>
        <el-input
          v-model="searchInput"
          placeholder="Nombre, SKU o marca..."
          clearable
          size="default"
        >
          <template #prefix>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </el-input>
      </div>

      <!-- Category Select -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Categoría</label>
        <el-select
          v-model="localFilters.category"
          placeholder="Todas las categorías"
          clearable
          filterable
          class="w-full"
          :loading="isCategoriesLoading"
        >
          <el-option label="Todas las categorías" value="all" />
          <el-option
            v-for="cat in categories"
            :key="cat.slug"
            :label="cat.name"
            :value="cat.slug"
          />
        </el-select>
      </div>

      <!-- Status Select -->
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
        <el-select
          v-model="localFilters.status"
          placeholder="Todos los estados"
          clearable
          class="w-full"
        >
          <el-option
            v-for="opt in PRODUCT_STATUS_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
    </div>

    <!-- Advanced Range Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3 border-t border-gray-100 items-center">
      <!-- Price Range Slider & Inputs -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-xs font-semibold text-gray-600">Rango de Precio ($)</label>
          <span class="text-xs font-mono font-medium text-brand-600">
            ${{ localFilters.minPrice }} - ${{ localFilters.maxPrice }}
          </span>
        </div>
        <el-slider
          v-model="priceRange"
          range
          :min="0"
          :max="2000"
          :step="10"
          @change="handlePriceRangeChange"
        />
        <div class="flex items-center gap-2 mt-1">
          <el-input-number
            v-model="localFilters.minPrice"
            :min="0"
            :max="localFilters.maxPrice"
            size="small"
            controls-position="right"
            class="w-full"
            placeholder="Mín"
          />
          <span class="text-gray-400 text-xs">-</span>
          <el-input-number
            v-model="localFilters.maxPrice"
            :min="localFilters.minPrice"
            :max="2000"
            size="small"
            controls-position="right"
            class="w-full"
            placeholder="Máx"
          />
        </div>
      </div>

      <!-- Rating Slider -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-xs font-semibold text-gray-600">Rating Mínimo</label>
          <span class="text-xs font-semibold text-amber-600 flex items-center gap-1">
            <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {{ localFilters.minRating }} / 5.0
          </span>
        </div>
        <el-slider
          v-model="localFilters.minRating"
          :min="0"
          :max="5"
          :step="0.5"
          show-stops
        />
      </div>

      <!-- Checkbox & Switch controls -->
      <div class="flex flex-wrap items-center gap-6 justify-between md:justify-end">
        <el-checkbox v-model="localFilters.inStockOnly">
          <span class="text-xs font-medium text-gray-700">Solo con stock</span>
        </el-checkbox>

        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-700">Activados:</span>
          <el-switch v-model="localFilters.isActive" />
        </div>

        <el-button type="primary" class="w-full sm:w-auto" @click="handleApply">
          <template #icon>
            <Search class="w-4 h-4" />
          </template>
          Buscar
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Filter, RotateCcw, Search, Star } from 'lucide-vue-next'
import type { ProductCategory, ProductFilters } from '../types/product.types'
import { PRODUCT_STATUS_OPTIONS } from '@/utils/constants'
import { useDebounce } from '@/composables/useDebounce'

const props = defineProps<{
  filters: ProductFilters
  categories: ProductCategory[]
  isCategoriesLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: ProductFilters): void
  (e: 'reset'): void
}>()

const searchInput = ref<string>(props.filters.search || '')
const debouncedSearch = useDebounce(searchInput, 400)

const localFilters = reactive({
  category: props.filters.category || 'all',
  status: props.filters.status || 'all',
  minPrice: props.filters.minPrice ?? 0,
  maxPrice: props.filters.maxPrice ?? 2000,
  minRating: props.filters.minRating ?? 0,
  inStockOnly: props.filters.inStockOnly ?? false,
  isActive: props.filters.isActive ?? true,
})

const priceRange = ref<[number, number]>([localFilters.minPrice, localFilters.maxPrice])

const handlePriceRangeChange = (val: [number, number]): void => {
  localFilters.minPrice = val[0]
  localFilters.maxPrice = val[1]
}

watch(
  [() => localFilters.minPrice, () => localFilters.maxPrice],
  ([newMin, newMax]) => {
    priceRange.value = [newMin ?? 0, newMax ?? 2000]
  }
)

// Watch debounced search
watch(debouncedSearch, (newSearch) => {
  emit('update:filters', {
    ...props.filters,
    search: newSearch,
    page: 1,
  })
})

const handleApply = (): void => {
  emit('update:filters', {
    ...props.filters,
    search: searchInput.value,
    category: localFilters.category,
    status: localFilters.status,
    minPrice: localFilters.minPrice,
    maxPrice: localFilters.maxPrice,
    minRating: localFilters.minRating,
    inStockOnly: localFilters.inStockOnly,
    isActive: localFilters.isActive,
    page: 1,
  })
}

const handleReset = (): void => {
  searchInput.value = ''
  localFilters.category = 'all'
  localFilters.status = 'all'
  localFilters.minPrice = 0
  localFilters.maxPrice = 2000
  localFilters.minRating = 0
  localFilters.inStockOnly = false
  localFilters.isActive = true
  priceRange.value = [0, 2000]

  emit('reset')
}
</script>
