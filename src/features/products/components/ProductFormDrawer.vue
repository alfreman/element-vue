<template>
  <el-drawer
    :model-value="modelValue"
    :title="drawerTitle"
    direction="rtl"
    size="680px"
    :before-close="handleBeforeClose"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="isLoadingProduct" class="p-6">
      <AppLoading :rows="10" />
    </div>

    <form v-else class="space-y-6 pb-12" @submit.prevent="onSubmit">
      <!-- Section 1: General Info -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info class="w-4 h-4 text-brand-600" />
          Información General
        </h3>

        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">
              Nombre del producto <span class="text-red-500">*</span>
            </label>
            <el-input
              v-model="title"
              placeholder="Ej. Laptop Gaming Pro 15''"
              maxlength="100"
              show-word-limit
              :disabled="isReadOnly"
            />
            <span v-if="errors.title" class="text-xs text-red-500 mt-1 block font-medium">
              {{ errors.title }}
            </span>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">
              Descripción detallada <span class="text-red-500">*</span>
            </label>
            <el-input
              v-model="description"
              type="textarea"
              :rows="3"
              placeholder="Describa las especificaciones principales y características del producto..."
              :disabled="isReadOnly"
            />
            <span v-if="errors.description" class="text-xs text-red-500 mt-1 block font-medium">
              {{ errors.description }}
            </span>
          </div>

          <!-- SKU & Brand Autocomplete -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                SKU / Código <span class="text-red-500">*</span>
              </label>
              <el-input
                v-model="sku"
                placeholder="SKU-100200"
                :disabled="isReadOnly"
              />
              <span v-if="errors.sku" class="text-xs text-red-500 mt-1 block font-medium">
                {{ errors.sku }}
              </span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">
                Marca <span class="text-red-500">*</span>
              </label>
              <el-autocomplete
                v-model="brand"
                :fetch-suggestions="queryBrandSuggestions"
                placeholder="Ej. Apple, Samsung"
                class="w-full"
                :disabled="isReadOnly"
                @select="(item: any) => brand = item.value"
              />
              <span v-if="errors.brand" class="text-xs text-red-500 mt-1 block font-medium">
                {{ errors.brand }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Categories & Dependent Selects -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Layers class="w-4 h-4 text-brand-600" />
          Categorización & Subcategoría Dependiente
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Category -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">
              Categoría principal <span class="text-red-500">*</span>
            </label>
            <el-select
              v-model="category"
              placeholder="Seleccionar categoría"
              filterable
              class="w-full"
              :disabled="isReadOnly"
              @change="handleCategoryChange"
            >
              <el-option
                v-for="cat in categories"
                :key="cat.slug"
                :label="cat.name"
                :value="cat.slug"
              />
            </el-select>
            <span v-if="errors.category" class="text-xs text-red-500 mt-1 block font-medium">
              {{ errors.category }}
            </span>
          </div>

          <!-- Dependent Subcategory -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">
              Subcategoría dependiente
            </label>
            <el-select
              v-model="subcategory"
              placeholder="Seleccionar subcategoría"
              clearable
              class="w-full"
              :disabled="isReadOnly || availableSubcategories.length === 0"
            >
              <el-option
                v-for="sub in availableSubcategories"
                :key="sub"
                :label="sub"
                :value="sub"
              />
            </el-select>
            <p v-if="availableSubcategories.length === 0" class="text-[11px] text-gray-400 mt-1">
              Seleccione primero una categoría con subcategorías configuradas.
            </p>
          </div>
        </div>
      </div>

      <!-- Section 3: Pricing, Discount & Rating -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <DollarSign class="w-4 h-4 text-brand-600" />
          Precios & Descuentos
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">
              Precio ($) <span class="text-red-500">*</span>
            </label>
            <el-input-number
              v-model="price"
              :min="0.01"
              :precision="2"
              :step="5"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
            <span v-if="errors.price" class="text-xs text-red-500 mt-1 block font-medium">
              {{ errors.price }}
            </span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Descuento (%)</label>
            <el-input-number
              v-model="discountPercentage"
              :min="0"
              :max="100"
              :precision="1"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
            <span v-if="errors.discountPercentage" class="text-xs text-red-500 mt-1 block font-medium">
              {{ errors.discountPercentage }}
            </span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Precio Final Estimado</label>
            <div class="h-8 px-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center">
              {{ formatCurrency(calculatedFinalPrice) }}
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">
            Rating del producto (0.0 - 5.0)
          </label>
          <el-slider
            v-model="rating"
            :min="0"
            :max="5"
            :step="0.1"
            show-input
            :disabled="isReadOnly"
          />
        </div>
      </div>

      <!-- Section 4: Inventory, Status & Badges -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <PackageCheck class="w-4 h-4 text-brand-600" />
          Inventario & Estado del Registro
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">
              Stock actual (unidades) <span class="text-red-500">*</span>
            </label>
            <el-input-number
              v-model="stock"
              :min="0"
              :step="1"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
            <span v-if="errors.stock" class="text-xs text-red-500 mt-1 block font-medium">
              {{ errors.stock }}
            </span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Cantidad mínima por pedido</label>
            <el-input-number
              v-model="minimumOrderQuantity"
              :min="1"
              :step="1"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
          </div>
        </div>

        <!-- Availability Status Radio Group -->
        <div class="mb-4">
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">Estado del Registro</label>
          <el-radio-group v-model="availabilityStatus" :disabled="isReadOnly">
            <el-radio-button label="Activo">Activo</el-radio-button>
            <el-radio-button label="Inactivo">Inactivo</el-radio-button>
            <el-radio-button label="Borrador">Borrador</el-radio-button>
          </el-radio-group>
        </div>

        <!-- Checkbox Flags -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">Etiquetas Destacadas</label>
          <div class="flex flex-wrap gap-4">
            <el-checkbox v-model="isFeatured" :disabled="isReadOnly">Destacado</el-checkbox>
            <el-checkbox v-model="isNew" :disabled="isReadOnly">Nuevo Producto</el-checkbox>
            <el-checkbox v-model="isOnSale" :disabled="isReadOnly">En Oferta</el-checkbox>
            <el-checkbox v-model="allowReturn" :disabled="isReadOnly">Permite Devolución</el-checkbox>
          </div>
        </div>
      </div>

      <!-- Section 5: Logistics & Dimensions -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Truck class="w-4 h-4 text-brand-600" />
          Dimensiones & Logística
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Peso (kg)</label>
            <el-input-number
              v-model="weight"
              :min="0"
              :precision="2"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Ancho (cm)</label>
            <el-input-number
              v-model="width"
              :min="0"
              :precision="1"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Alto (cm)</label>
            <el-input-number
              v-model="height"
              :min="0"
              :precision="1"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-gray-600 mb-1">Profundidad (cm)</label>
            <el-input-number
              v-model="depth"
              :min="0"
              :precision="1"
              controls-position="right"
              class="w-full"
              :disabled="isReadOnly"
            />
          </div>
        </div>
      </div>

      <!-- Section 6: Dates & Promotion Validity -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar class="w-4 h-4 text-brand-600" />
          Fechas & Vigencia de Promoción
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Fecha de Disponibilidad</label>
            <el-date-picker
              v-model="availabilityDate"
              type="date"
              placeholder="Seleccionar fecha"
              class="w-full"
              format="YYYY-MM-DD"
              :disabled="isReadOnly"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Rango Vigencia Promoción</label>
            <el-date-picker
              v-model="promotionDateRange"
              type="daterange"
              range-separator="a"
              start-placeholder="Inicio"
              end-placeholder="Fin"
              class="w-full"
              format="YYYY-MM-DD"
              :disabled="isReadOnly"
            />
          </div>
        </div>
      </div>

      <!-- Section 7: Image Upload Simulation -->
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <UploadCloud class="w-4 h-4 text-brand-600" />
          Imágenes del Producto (Upload & Preview)
        </h3>

        <div v-if="!isReadOnly" class="mb-3">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="onUploadChange"
            :show-file-list="false"
            drag
            multiple
          >
            <div class="flex flex-col items-center justify-center text-gray-500 py-2">
              <Plus class="w-6 h-6 mb-1 text-gray-400" />
              <span class="text-xs">Arrastrar o Cargar</span>
            </div>
          </el-upload>
        </div>

        <!-- Custom Image Gallery Preview List -->
        <div v-if="images.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
          <div
            v-for="img in images"
            :key="img.id"
            class="relative group rounded-lg overflow-hidden border border-gray-300 bg-white aspect-square shadow-xs"
          >
            <img :src="img.url" :alt="img.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                class="p-1.5 rounded-full bg-white/90 text-gray-800 hover:text-brand-600"
                @click="handlePreviewImage(img.url)"
              >
                <Eye class="w-4 h-4" />
              </button>
              <button
                v-if="!isReadOnly"
                type="button"
                class="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-red-50"
                @click="handleRemoveImage(img.id)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Image Modal Preview -->
    <el-dialog v-model="previewVisible" title="Vista Previa de Imagen" width="500px" append-to-body>
      <img :src="previewUrl" alt="Preview" class="w-full h-auto rounded-lg" />
    </el-dialog>

    <!-- Footer Actions -->
    <template #footer>
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <span class="text-xs text-gray-500">
          <span v-if="meta.dirty" class="text-amber-600 font-medium">* Cambios sin guardar</span>
        </span>

        <div class="flex items-center gap-3">
          <el-button @click="handleClose">
            {{ isReadOnly ? 'Cerrar' : 'Cancelar' }}
          </el-button>

          <el-button
            v-if="!isReadOnly"
            type="primary"
            :loading="isSubmitting"
            @click="onSubmit"
          >
            {{ isEditMode ? 'Guardar Cambios' : 'Registrar Producto' }}
          </el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, watch, toRef } from 'vue'
import {
  Info,
  Layers,
  DollarSign,
  PackageCheck,
  Truck,
  Calendar,
  UploadCloud,
  Plus,
  Eye,
  Trash2,
} from 'lucide-vue-next'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { Product, ProductCategory, ProductFormValues } from '../types/product.types'
import { useProductForm } from '../composables/useProductForm'
import { useImagePreview } from '../composables/useImagePreview'
import { CATEGORY_SUBCATEGORY_MAP, BRAND_SUGGESTIONS } from '@/utils/constants'
import { formatCurrency } from '@/utils/formatters'
import AppLoading from '@/components/common/AppLoading.vue'

const props = defineProps<{
  modelValue: boolean
  product?: Product | null
  categories: ProductCategory[]
  isSubmitting?: boolean
  isLoadingProduct?: boolean
  isReadOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', formValues: ProductFormValues): void
}>()

const productRef = toRef(props, 'product')

const {
  handleSubmit,
  errors,
  meta,
  // Defined field refs
  title,
  description,
  category,
  subcategory,
  brand,
  sku,
  price,
  discountPercentage,
  rating,
  stock,
  minimumOrderQuantity,
  availabilityStatus,
  warrantyInformation,
  shippingInformation,
  returnPolicy,
  weight,
  width,
  height,
  depth,
  isFeatured,
  isNew,
  isOnSale,
  allowReturn,
  availabilityDate,
  promotionDateRange,
} = useProductForm(productRef)

const {
  images,
  previewVisible,
  previewUrl,
  handleAddFile,
  handleRemoveImage,
  handlePreviewImage,
  setInitialImages,
} = useImagePreview()

const isEditMode = computed(() => !!props.product)

const drawerTitle = computed(() => {
  if (props.isReadOnly) return `Detalle del Producto: #${props.product?.id}`
  return isEditMode.value ? `Editar Producto: ${props.product?.title}` : 'Nuevo Producto'
})

// Sync form images with image preview composable
watch(
  () => props.product,
  (newProd) => {
    if (newProd && newProd.images) {
      setInitialImages(newProd.images)
    } else {
      setInitialImages([])
    }
  },
  { immediate: true }
)

const availableSubcategories = computed(() => {
  if (!category.value) return []
  return CATEGORY_SUBCATEGORY_MAP[category.value] || ['General', 'Premium', 'Accesorios']
})

const calculatedFinalPrice = computed(() => {
  const p = price.value || 0
  const d = discountPercentage.value || 0
  if (d <= 0) return p
  return p * (1 - d / 100)
})

const queryBrandSuggestions = (query: string, cb: (results: { value: string }[]) => void): void => {
  const results = BRAND_SUGGESTIONS.filter((b) => b.toLowerCase().includes(query.toLowerCase())).map((b) => ({
    value: b,
  }))
  cb(results.length > 0 ? results : [{ value: query }])
}

const handleCategoryChange = (slug: string): void => {
  category.value = slug
  subcategory.value = ''
}

const onUploadChange = (uploadFile: any): void => {
  if (uploadFile.raw) {
    handleAddFile(uploadFile.raw)
  }
}

const handleClose = (): void => {
  if (!props.isReadOnly && meta.value.dirty) {
    ElMessageBox.confirm(
      'Tienes cambios sin guardar en el formulario. ¿Deseas salir sin guardar?',
      '¿Deseas salir?',
      {
        confirmButtonText: 'Salir sin guardar',
        cancelButtonText: 'Continuar editando',
        type: 'warning',
      }
    )
      .then(() => {
        emit('update:modelValue', false)
      })
      .catch(() => {})
  } else {
    emit('update:modelValue', false)
  }
}

const handleBeforeClose = (done: () => void): void => {
  if (!props.isReadOnly && meta.value.dirty) {
    ElMessageBox.confirm(
      'Tienes cambios sin guardar en el formulario. ¿Deseas salir sin guardar?',
      '¿Deseas salir?',
      {
        confirmButtonText: 'Salir sin guardar',
        cancelButtonText: 'Continuar editando',
        type: 'warning',
      }
    )
      .then(() => {
        done()
      })
      .catch(() => {})
  } else {
    done()
  }
}

const onSubmit = handleSubmit(
  (formValues) => {
    // Attach preview image URLs to payload
    const currentImages = images.value.map((img) => img.url)
    formValues.images = currentImages
    if (currentImages.length > 0) {
      formValues.thumbnail = currentImages[0]
    }

    emit('submit', formValues)
  },
  ({ errors: validationErrors }) => {
    const errorKeys = Object.keys(validationErrors)
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0] as keyof typeof validationErrors
      const message = validationErrors[firstErrorKey]
      ElMessage.error({
        message: `Por favor revise los campos requeridos: ${message}`,
        duration: 5000,
      })
    }
  }
)
</script>
