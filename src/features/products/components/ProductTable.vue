<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
    <!-- Selection & Quick Action Toolbar -->
    <div
      v-if="selectedRowIds.length > 0"
      class="bg-blue-50 px-4 py-2.5 border-b border-blue-200 flex items-center justify-between text-xs text-brand-900"
    >
      <span class="font-medium">
        {{ selectedRowIds.length }} producto(s) seleccionado(s)
      </span>
      <el-button size="small" type="danger" plain @click="handleBulkDelete">
        Eliminar seleccionados
      </el-button>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto min-h-[380px]">
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
        description="No se encontraron productos coincidentes."
      >
        <template #actions>
          <el-button type="primary" size="small" @click="$emit('reset-filters')">
            Restablecer Filtros
          </el-button>
        </template>
      </AppEmptyState>

      <!-- TanStack Data Table -->
      <table v-else class="w-full text-left border-collapse text-sm text-gray-700">
        <thead class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="px-4 py-3 select-none"
              :class="[
                header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-100 transition-colors' : '',
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
                    class="w-3.5 h-3.5 text-gray-400 opacity-60"
                  />
                  <ArrowUp
                    v-else-if="header.column.getIsSorted() === 'asc'"
                    class="w-3.5 h-3.5 text-brand-600 font-bold"
                  />
                  <ArrowDown
                    v-else
                    class="w-3.5 h-3.5 text-brand-600 font-bold"
                  />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="hover:bg-gray-50/80 transition-colors"
            :class="[row.getIsSelected() ? 'bg-blue-50/40' : '']"
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

    <!-- Table Pagination Footer -->
    <div
      v-if="data && data.length > 0"
      class="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="text-xs text-gray-500">
        Mostrando
        <span class="font-medium text-gray-800">{{ (page - 1) * pageSize + 1 }}</span>
        a
        <span class="font-medium text-gray-800">{{ Math.min(page * pageSize, total) }}</span>
        de
        <span class="font-medium text-gray-800">{{ total }}</span> resultados
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
        return h('div', { class: 'w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400' }, [
          h(ImageIcon, { class: 'w-5 h-5' }),
        ])
      }
      return h(ElImage, {
        src,
        previewSrcList: previewList,
        previewTeleported: true,
        fit: 'cover',
        class: 'w-10 h-10 rounded-md border border-gray-200 cursor-pointer hover:scale-105 transition-transform',
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
        h('span', { class: 'font-semibold text-gray-900 line-clamp-1' }, product.title),
        h('span', { class: 'text-xs text-gray-500 line-clamp-1' }, product.brand || 'Marca genérica'),
      ])
    },
  }),

  // SKU Column
  columnHelper.accessor('sku', {
    id: 'sku',
    header: 'SKU',
    cell: ({ row }) =>
      h('span', { class: 'font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded' }, row.original.sku || `SKU-${row.original.id}`),
  }),

  // Category Column
  columnHelper.accessor('category', {
    id: 'category',
    header: 'Categoría',
    cell: ({ row }) =>
      h(
        ElTag,
        { size: 'small', type: 'info', effect: 'plain', class: 'capitalize font-medium' },
        () => row.original.category
      ),
  }),

  // Price Column
  columnHelper.accessor('price', {
    id: 'price',
    header: 'Precio',
    cell: ({ row }) =>
      h('span', { class: 'font-semibold text-gray-900' }, formatCurrency(row.original.price)),
  }),

  // Discount Column
  columnHelper.accessor('discountPercentage', {
    id: 'discountPercentage',
    header: 'Descuento',
    cell: ({ row }) => {
      const discount = row.original.discountPercentage
      if (!discount || discount <= 0) return h('span', { class: 'text-gray-400 text-xs' }, '-')
      return h(ElTag, { size: 'small', type: 'danger', effect: 'light' }, () => `-${discount.toFixed(0)}%`)
    },
  }),

  // Rating Column
  columnHelper.accessor('rating', {
    id: 'rating',
    header: 'Rating',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-1 font-medium text-xs text-amber-600' }, [
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
      const colorClass = stock === 0 ? 'text-red-600 font-bold' : stock < 10 ? 'text-amber-600 font-medium' : 'text-gray-800'
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
              { size: 'small', text: true, class: 'p-1 text-gray-500 hover:text-gray-900' },
              () => h(MoreVertical, { class: 'w-4 h-4' })
            ),
          dropdown: () =>
            h(ElDropdownMenu, null, () => [
              h(
                ElDropdownItem,
                { onClick: () => emit('view', product) },
                () => h('div', { class: 'flex items-center gap-2 text-xs' }, [h(Eye, { class: 'w-3.5 h-3.5 text-blue-600' }), 'Ver detalle'])
              ),
              h(
                ElDropdownItem,
                { onClick: () => emit('edit', product) },
                () => h('div', { class: 'flex items-center gap-2 text-xs' }, [h(Edit, { class: 'w-3.5 h-3.5 text-amber-600' }), 'Editar'])
              ),
              h(
                ElDropdownItem,
                {
                  divided: true,
                  onClick: () => confirmDeleteProduct(product),
                },
                () => h('div', { class: 'flex items-center gap-2 text-xs text-red-600 font-medium' }, [h(Trash2, { class: 'w-3.5 h-3.5' }), 'Eliminar'])
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
