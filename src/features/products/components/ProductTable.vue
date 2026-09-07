<template>
  <div class="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
    <!-- Selection & Quick Action Toolbar -->
    <div
      v-if="selectedRows.length > 0"
      class="bg-blue-50/80 px-4 py-3 border-b border-blue-200/80 flex items-center justify-between text-xs text-brand-900"
    >
      <span class="font-bold flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        {{ selectedRows.length }} producto(s) seleccionado(s)
      </span>
      <el-button size="small" type="danger" plain @click="handleBulkDelete">
        Eliminar seleccionados
      </el-button>
    </div>

    <!-- Table / Mobile Cards Container -->
    <div class="min-h-[380px]">
      <!-- Loading Skeleton -->
      <AppLoading v-if="isLoading" :rows="8" />

      <!-- Error State -->
      <AppErrorState
        v-else-if="isError"
        :message="errorMessage"
        @retry="$emit('retry')"
      />

      <!-- Empty State -->
      <AppEmptyState
        v-else-if="!data || data.length === 0"
        description="No se encontraron productos coincidentes con los filtros seleccionados."
      >
        <template #actions>
          <el-button type="primary" size="small" @click="$emit('reset-filters')">
            Restablecer Filtros
          </el-button>
        </template>
      </AppEmptyState>

      <div v-else>
        <!-- Desktop / Tablet Customized Element Plus Table View -->
        <div class="hidden md:block overflow-x-auto">
          <el-table
            ref="tableRef"
            :data="data"
            style="width: 100%"
            row-key="id"
            header-cell-class-name="!bg-slate-50/90 !text-xs !font-bold !text-slate-600 !uppercase tracking-wider !py-3.5"
            row-class-name="hover:!bg-blue-50/30 transition-colors group text-sm text-slate-700"
            @selection-change="handleSelectionChange"
          >
            <!-- Selection Column -->
            <el-table-column type="selection" width="50" align="center" />

            <!-- Thumbnail Column -->
            <el-table-column label="Imagen" width="85" align="center">
              <template #default="{ row }">
                <div class="flex justify-center items-center">
                  <el-image
                    v-if="row.thumbnail || row.images?.[0]"
                    :src="row.thumbnail || row.images?.[0]"
                    :preview-src-list="row.images || [row.thumbnail]"
                    preview-teleported
                    fit="cover"
                    class="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer hover:scale-110 transition-transform duration-200"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400"
                  >
                    <ImageIcon class="w-5 h-5" />
                  </div>
                </div>
              </template>
            </el-table-column>

            <!-- Product Title & Brand Column -->
            <el-table-column prop="title" label="Producto" min-width="220" sortable>
              <template #default="{ row }">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {{ row.title }}
                  </span>
                  <span class="text-xs text-slate-500 font-medium line-clamp-1">
                    {{ row.brand || 'Marca genérica' }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <!-- SKU Column -->
            <el-table-column prop="sku" label="SKU" width="130">
              <template #default="{ row }">
                <span class="font-mono text-xs text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded font-semibold border border-slate-200/60">
                  {{ row.sku || `SKU-${row.id}` }}
                </span>
              </template>
            </el-table-column>

            <!-- Category Column -->
            <el-table-column prop="category" label="Categoría" width="130">
              <template #default="{ row }">
                <el-tag size="small" type="info" effect="plain" class="capitalize font-bold border-blue-200 text-blue-700 bg-blue-50/60">
                  {{ row.category }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- Price Column -->
            <el-table-column prop="price" label="Precio" width="120" align="right" sortable>
              <template #default="{ row }">
                <span class="font-extrabold text-slate-900">
                  {{ formatCurrency(row.price) }}
                </span>
              </template>
            </el-table-column>

            <!-- Discount Column -->
            <el-table-column prop="discountPercentage" label="Descuento" width="110" align="center">
              <template #default="{ row }">
                <el-tag
                  v-if="row.discountPercentage && row.discountPercentage > 0"
                  size="small"
                  type="danger"
                  effect="light"
                  class="font-bold"
                >
                  -{{ row.discountPercentage.toFixed(0) }}%
                </el-tag>
                <span v-else class="text-slate-400 text-xs">-</span>
              </template>
            </el-table-column>

            <!-- Rating Column -->
            <el-table-column prop="rating" label="Rating" width="100" align="center" sortable>
              <template #default="{ row }">
                <div class="flex items-center gap-1 font-bold text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 w-fit mx-auto">
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{{ row.rating ? row.rating.toFixed(1) : '4.5' }}</span>
                </div>
              </template>
            </el-table-column>

            <!-- Stock Column -->
            <el-table-column prop="stock" label="Stock" width="100" align="center" sortable>
              <template #default="{ row }">
                <span
                  :class="[
                    row.stock === 0
                      ? 'text-red-600 font-bold'
                      : row.stock < 10
                      ? 'text-amber-600 font-bold'
                      : 'text-slate-800 font-bold',
                  ]"
                >
                  {{ row.stock }} un.
                </span>
              </template>
            </el-table-column>

            <!-- Status Column -->
            <el-table-column prop="availabilityStatus" label="Estado" width="130" align="center">
              <template #default="{ row }">
                <ProductStatus
                  :status="row.availabilityStatus || 'Activo'"
                  :stock="row.stock"
                />
              </template>
            </el-table-column>

            <!-- Actions Column -->
            <el-table-column label="Acciones" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-dropdown trigger="click" placement="bottom-end">
                  <el-button
                    size="small"
                    text
                    class="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  >
                    <MoreVertical class="w-4 h-4" />
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu class="!rounded-xl !p-1">
                      <el-dropdown-item class="!rounded-lg" @click="$emit('view', row)">
                        <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <Eye class="w-3.5 h-3.5 text-blue-600" />
                          <span>Ver detalle</span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item class="!rounded-lg" @click="$emit('edit', row)">
                        <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <Edit class="w-3.5 h-3.5 text-amber-600" />
                          <span>Editar</span>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item
                        divided
                        class="!rounded-lg"
                        @click="confirmDeleteProduct(row)"
                      >
                        <div class="flex items-center gap-2 text-xs text-red-600 font-bold">
                          <Trash2 class="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- Mobile Cards Grid View (visible only on small mobile screens) -->
        <div class="block md:hidden p-4 space-y-4">
          <div
            v-for="product in data"
            :key="product.id"
            class="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <el-image
                  :src="product.thumbnail || product.images?.[0]"
                  :preview-src-list="product.images"
                  preview-teleported
                  fit="cover"
                  class="w-14 h-14 rounded-lg border border-slate-200 flex-shrink-0"
                />
                <div>
                  <h4 class="font-bold text-slate-900 text-sm line-clamp-1">{{ product.title }}</h4>
                  <p class="text-xs text-slate-500 font-medium">{{ product.brand || 'Marca Genérica' }}</p>
                  <span class="inline-block mt-1 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    {{ product.sku || `SKU-${product.id}` }}
                  </span>
                </div>
              </div>
              <ProductStatus :status="product.availabilityStatus || 'Activo'" :stock="product.stock" />
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span class="text-slate-500">Precio: </span>
                <span class="font-bold text-slate-900 text-sm">{{ formatCurrency(product.price) }}</span>
              </div>
              <div>
                <span class="text-slate-500">Stock: </span>
                <span class="font-bold text-slate-800">{{ product.stock }} un.</span>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <el-button size="small" plain @click="$emit('view', product)">
                <template #icon><Eye class="w-3.5 h-3.5 text-blue-600" /></template>
                Ver
              </el-button>
              <el-button size="small" type="primary" plain @click="$emit('edit', product)">
                <template #icon><Edit class="w-3.5 h-3.5" /></template>
                Editar
              </el-button>
              <el-button size="small" type="danger" plain @click="confirmDeleteProduct(product)">
                <template #icon><Trash2 class="w-3.5 h-3.5" /></template>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Pagination Footer -->
    <div
      v-if="data && data.length > 0"
      class="px-4 py-3.5 border-t border-slate-200/80 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="text-xs text-slate-500 font-medium">
        Mostrando
        <span class="font-bold text-slate-800">{{ (page - 1) * pageSize + 1 }}</span>
        a
        <span class="font-bold text-slate-800">{{ Math.min(page * pageSize, total) }}</span>
        de
        <span class="font-bold text-slate-800">{{ total }}</span> resultados
      </div>

      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="DEFAULT_PAGE_SIZES"
        :total="total"
        layout="sizes, prev, pager, next, jumper"
        size="small"
        background
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElImage,
  ElTag,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton,
  ElMessageBox,
  ElMessage,
  ElPagination,
} from 'element-plus'
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  Image as ImageIcon,
} from 'lucide-vue-next'
import type { Product } from '../types/product.types'
import ProductStatus from './ProductStatus.vue'
import AppLoading from '@/components/common/AppLoading.vue'
import AppErrorState from '@/components/common/AppErrorState.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import { formatCurrency } from '@/utils/formatters'
import { DEFAULT_PAGE_SIZES } from '@/utils/constants'

const props = withDefaults(
  defineProps<{
    data: Product[]
    total: number
    page: number
    pageSize: number
    isLoading?: boolean
    isError?: boolean
    errorMessage?: string
  }>(),
  {
    isLoading: false,
    isError: false,
    errorMessage: 'Error al cargar productos',
  }
)

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'view', product: Product): void
  (e: 'edit', product: Product): void
  (e: 'delete', productId: number): void
  (e: 'retry'): void
  (e: 'reset-filters'): void
}>()

const tableRef = ref<InstanceType<typeof ElTable> | null>(null)
const selectedRows = ref<Product[]>([])

const handleSelectionChange = (rows: Product[]) => {
  selectedRows.value = rows
}

const confirmDeleteProduct = (product: Product): void => {
  ElMessageBox.confirm(
    `¿Está seguro de eliminar el producto "${product.title}"? Esta acción no se puede deshacer.`,
    'Eliminar Producto',
    {
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }
  )
    .then(() => {
      emit('delete', product.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const handleBulkDelete = (): void => {
  ElMessageBox.confirm(
    `¿Desea eliminar los ${selectedRows.value.length} productos seleccionados?`,
    'Eliminación Masiva',
    {
      confirmButtonText: 'Eliminar Todos',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }
  ).then(() => {
    ElMessage.success(`${selectedRows.value.length} productos eliminados exitosamente`)
    if (tableRef.value) {
      tableRef.value.clearSelection()
    }
    selectedRows.value = []
  })
}

const handlePageChange = (newPage: number): void => {
  emit('update:page', newPage)
}

const handlePageSizeChange = (newSize: number): void => {
  emit('update:pageSize', newSize)
}
</script>

