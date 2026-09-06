<template>
  <div class="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
    <!-- Selection & Quick Action Toolbar -->
    <div
      v-if="selectedRowIds.length > 0"
      class="bg-blue-50/80 px-4 py-3 border-b border-blue-200/80 flex items-center justify-between text-xs text-brand-900"
    >
      <span class="font-bold flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        {{ selectedRowIds.length }} producto(s) seleccionado(s)
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
        <!-- Desktop / Tablet Table View (hidden on small mobile screens) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm text-slate-700">
            <thead class="bg-slate-50/90 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                <th
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  class="px-4 py-3.5 select-none"
                  :class="[
                    header.column.getCanSort() ? 'cursor-pointer hover:bg-slate-100 transition-colors' : '',
                    header.id === 'select' ? 'w-10 text-center' : '',
                    header.id === 'actions' ? 'w-24 text-right' : '',
                  ]"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <div class="flex items-center gap-1.5" :class="[header.id === 'actions' ? 'justify-end' : '']">
                    <FlexRender
                      v-if="!header.isPlaceholder"
                      :render="header.column.columnDef.header"
                      :props="header.getContext()"
                    />
                    <span v-if="header.column.getCanSort()">
                      <ArrowUpDown
                        v-if="!header.column.getIsSorted()"
                        class="w-3.5 h-3.5 text-slate-400 opacity-60"
                      />
                      <ArrowUp
                        v-else-if="header.column.getIsSorted() === 'asc'"
                        class="w-3.5 h-3.5 text-blue-600 font-bold"
                      />
                      <ArrowDown
                        v-else
                        class="w-3.5 h-3.5 text-blue-600 font-bold"
                      />
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200/80 bg-white">
              <tr
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                class="hover:bg-blue-50/30 transition-colors group"
                :class="[row.getIsSelected() ? 'bg-blue-50/50' : '']"
              >
                <td
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  class="px-4 py-3 align-middle"
                  :class="[cell.column.id === 'actions' ? 'text-right' : '']"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
import { ref, computed, h } from 'vue'
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  FlexRender,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/vue-table'
import { ElCheckbox, ElImage, ElTag, ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElMessageBox, ElMessage } from 'element-plus'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  Image as ImageIcon,
} from 'lucide-vue-next'
import type { Product } from '../types/product.types'
import ProductStatus from './ProductStatus.vue'
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

const sorting = ref<SortingState>([])
const rowSelection = ref<RowSelectionState>({})

const columnHelper = createColumnHelper<Product>()

const selectedRowIds = computed(() => {
  return Object.keys(rowSelection.value).filter((key) => rowSelection.value[key])
})

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

// Define TanStack Table Columns
const columns = [
  // Selection Column
  columnHelper.display({
    id: 'select',
    header: ({ table }) =>
      h(ElCheckbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected(),
        'onUpdate:modelValue': (val: boolean) => table.toggleAllPageRowsSelected(!!val),
      }),
    cell: ({ row }) =>
      h(ElCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (val: boolean) => row.toggleSelected(!!val),
      }),
  }),

  // Thumbnail Column
  columnHelper.accessor('thumbnail', {
    id: 'thumbnail',
    header: 'Imagen',
    enableSorting: false,
    cell: ({ row }) => {
      const src = row.original.thumbnail || row.original.images?.[0]
      const previewList = row.original.images || [src]
      if (!src) {
        return h('div', { class: 'w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400' }, [
          h(ImageIcon, { class: 'w-5 h-5' }),
        ])
      }
      return h(ElImage, {
        src,
        previewSrcList: previewList,
        previewTeleported: true,
        fit: 'cover',
        class: 'w-10 h-10 rounded-lg border border-slate-200 cursor-pointer hover:scale-110 transition-transform duration-200',
      })
    },
  }),

  // Title & Brand Column
  columnHelper.accessor('title', {
    id: 'title',
    header: 'Producto',
    cell: ({ row }) => {
      const product = row.original
      return h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors' }, product.title),
        h('span', { class: 'text-xs text-slate-500 font-medium line-clamp-1' }, product.brand || 'Marca genérica'),
      ])
    },
  }),

  // SKU Column
  columnHelper.accessor('sku', {
    id: 'sku',
    header: 'SKU',
    cell: ({ row }) =>
      h('span', { class: 'font-mono text-xs text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded font-semibold border border-slate-200/60' }, row.original.sku || `SKU-${row.original.id}`),
  }),

  // Category Column
  columnHelper.accessor('category', {
    id: 'category',
    header: 'Categoría',
    cell: ({ row }) =>
      h(
        ElTag,
        { size: 'small', type: 'info', effect: 'plain', class: 'capitalize font-bold border-blue-200 text-blue-700 bg-blue-50/60' },
        () => row.original.category
      ),
  }),

  // Price Column
  columnHelper.accessor('price', {
    id: 'price',
    header: 'Precio',
    cell: ({ row }) =>
      h('span', { class: 'font-extrabold text-slate-900' }, formatCurrency(row.original.price)),
  }),

  // Discount Column
  columnHelper.accessor('discountPercentage', {
    id: 'discountPercentage',
    header: 'Descuento',
    cell: ({ row }) => {
      const discount = row.original.discountPercentage
      if (!discount || discount <= 0) return h('span', { class: 'text-slate-400 text-xs' }, '-')
      return h(ElTag, { size: 'small', type: 'danger', effect: 'light', class: 'font-bold' }, () => `-${discount.toFixed(0)}%`)
    },
  }),

  // Rating Column
  columnHelper.accessor('rating', {
    id: 'rating',
    header: 'Rating',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-1 font-bold text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 w-fit' }, [
        h(Star, { class: 'w-3.5 h-3.5 fill-amber-400 text-amber-400' }),
        row.original.rating ? row.original.rating.toFixed(1) : '4.5',
      ]),
  }),

  // Stock Column
  columnHelper.accessor('stock', {
    id: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.original.stock
      const colorClass = stock === 0 ? 'text-red-600 font-bold' : stock < 10 ? 'text-amber-600 font-bold' : 'text-slate-800 font-bold'
      return h('span', { class: colorClass }, `${stock} un.`)
    },
  }),

  // Status Column
  columnHelper.accessor('availabilityStatus', {
    id: 'availabilityStatus',
    header: 'Estado',
    cell: ({ row }) =>
      h(ProductStatus, {
        status: row.original.availabilityStatus || 'Activo',
        stock: row.original.stock,
      }),
  }),

  // Actions Dropdown Column
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const product = row.original

      return h(
        ElDropdown,
        { trigger: 'click', placement: 'bottom-end' },
        {
          default: () =>
            h(
              ElButton,
              { size: 'small', text: true, class: 'p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg' },
              () => h(MoreVertical, { class: 'w-4 h-4' })
            ),
          dropdown: () =>
            h(ElDropdownMenu, { class: '!rounded-xl !p-1' }, () => [
              h(
                ElDropdownItem,
                { class: '!rounded-lg', onClick: () => emit('view', product) },
                () => h('div', { class: 'flex items-center gap-2 text-xs font-semibold text-slate-700' }, [h(Eye, { class: 'w-3.5 h-3.5 text-blue-600' }), 'Ver detalle'])
              ),
              h(
                ElDropdownItem,
                { class: '!rounded-lg', onClick: () => emit('edit', product) },
                () => h('div', { class: 'flex items-center gap-2 text-xs font-semibold text-slate-700' }, [h(Edit, { class: 'w-3.5 h-3.5 text-amber-600' }), 'Editar'])
              ),
              h(
                ElDropdownItem,
                {
                  divided: true,
                  class: '!rounded-lg',
                  onClick: () => confirmDeleteProduct(product),
                },
                () => h('div', { class: 'flex items-center gap-2 text-xs text-red-600 font-bold' }, [h(Trash2, { class: 'w-3.5 h-3.5' }), 'Eliminar'])
              ),
            ]),
        }
      )
    },
  }),
]

// Initialize TanStack Table instance
const table = useVueTable({
  get data() {
    return props.data
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

const handleBulkDelete = (): void => {
  ElMessageBox.confirm(
    `¿Desea eliminar los ${selectedRowIds.value.length} productos seleccionados?`,
    'Eliminación Masiva',
    {
      confirmButtonText: 'Eliminar Todos',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }
  ).then(() => {
    ElMessage.success(`${selectedRowIds.value.length} productos eliminados exitosamente`)
    rowSelection.value = {}
  })
}

const handlePageChange = (newPage: number): void => {
  emit('update:page', newPage)
}

const handlePageSizeChange = (newSize: number): void => {
  emit('update:pageSize', newSize)
}
</script>
