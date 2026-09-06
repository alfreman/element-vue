<template>
  <el-drawer
    :model-value="modelValue"
    :title="drawerTitle"
    direction="rtl"
    size="680px"
    class="responsive-product-drawer"
    append-to-body
    :before-close="handleBeforeClose"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="isLoadingProduct" class="p-6">
      <AppLoading :rows="10" />
    </div>

    <form v-else class="h-full flex flex-col overflow-hidden" @submit.prevent="onSubmit">
      <!-- Scrollable Continuous Single-Page Form Content Area -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <!-- Section 1: General Info -->
        <div class="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Info class="w-3.5 h-3.5" />
            </div>
            Información General
          </h3>

          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Nombre del producto <span class="text-red-500">*</span>
              </label>
              <el-input
                v-model="title"
                placeholder="Ej. Laptop Gaming Pro 15''"
                maxlength="100"
                show-word-limit
                :disabled="isReadOnly"
              />
              <span v-if="errors.title" class="text-xs text-red-500 mt-1 block font-bold">
                {{ errors.title }}
              </span>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                Descripción detallada <span class="text-red-500">*</span>
              </label>
              <el-input
                v-model="description"
                type="textarea"
                :rows="3"
                placeholder="Describa las especificaciones principales y características del producto..."
                :disabled="isReadOnly"
              />
              <span v-if="errors.description" class="text-xs text-red-500 mt-1 block font-bold">
                {{ errors.description }}
              </span>
            </div>

            <!-- SKU & Brand Autocomplete -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  SKU / Código <span class="text-red-500">*</span>
                </label>
                <el-input
                  v-model="sku"
                  placeholder="SKU-100200"
                  :disabled="isReadOnly"
                />
                <span v-if="errors.sku" class="text-xs text-red-500 mt-1 block font-bold">
                  {{ errors.sku }}
                </span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
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
                <span v-if="errors.brand" class="text-xs text-red-500 mt-1 block font-bold">
                  {{ errors.brand }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Categories & Dependent Selects -->
        <div class="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Layers class="w-3.5 h-3.5" />
            </div>
            Categorización & Subcategoría Dependiente
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Category -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
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
              <span v-if="errors.category" class="text-xs text-red-500 mt-1 block font-bold">
                {{ errors.category }}
              </span>
            </div>

            <!-- Dependent Subcategory -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
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
              <p v-if="availableSubcategories.length === 0" class="text-[11px] text-slate-400 mt-1">
                Seleccione primero una categoría con subcategorías configuradas.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 3: Pricing, Discount & Rating -->
        <div class="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign class="w-3.5 h-3.5" />
            </div>
            Precios & Descuentos
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
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
              <span v-if="errors.price" class="text-xs text-red-500 mt-1 block font-bold">
                {{ errors.price }}
              </span>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Descuento (%)</label>
              <el-input-number
                v-model="discountPercentage"
                :min="0"
                :max="100"
                :precision="1"
                controls-position="right"
                class="w-full"
                :disabled="isReadOnly"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Precio Final Estimado</label>
              <div class="h-8 px-3 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-800 font-extrabold text-sm flex items-center">
                {{ formatCurrency(calculatedFinalPrice) }}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Rating del producto (0.0 - 5.0)</label>
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
        <div class="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <PackageCheck class="w-3.5 h-3.5" />
            </div>
            Inventario & Estado del Registro
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
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
              <span v-if="errors.stock" class="text-xs text-red-500 mt-1 block font-bold">
                {{ errors.stock }}
              </span>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Cantidad mínima por pedido</label>
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

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">Estado del Registro</label>
            <el-radio-group v-model="availabilityStatus" :disabled="isReadOnly">
              <el-radio-button label="Activo">Activo</el-radio-button>
              <el-radio-button label="Inactivo">Inactivo</el-radio-button>
              <el-radio-button label="Borrador">Borrador</el-radio-button>
            </el-radio-group>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-2">Etiquetas Destacadas</label>
            <div class="flex flex-wrap gap-4">
              <el-checkbox v-model="isFeatured" :disabled="isReadOnly">
                <span class="font-semibold text-xs text-slate-700">Destacado</span>
              </el-checkbox>
              <el-checkbox v-model="isNew" :disabled="isReadOnly">
                <span class="font-semibold text-xs text-slate-700">Nuevo Producto</span>
              </el-checkbox>
              <el-checkbox v-model="isOnSale" :disabled="isReadOnly">
                <span class="font-semibold text-xs text-slate-700">En Oferta</span>
              </el-checkbox>
              <el-checkbox v-model="allowReturn" :disabled="isReadOnly">
                <span class="font-semibold text-xs text-slate-700">Permite Devolución</span>
              </el-checkbox>
            </div>
          </div>
        </div>

        <!-- Section 5: Logistics & Dimensions -->
        <div class="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Truck class="w-3.5 h-3.5" />
            </div>
            Dimensiones & Logística
          </h3>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Peso (kg)</label>
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Ancho (cm)</label>
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Alto (cm)</label>
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
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Profundidad (cm)</label>
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

        <!-- Section 6: Dates & Warranties -->
        <div class="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
              <Calendar class="w-3.5 h-3.5" />
            </div>
            Fechas & Garantías
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Fecha de Disponibilidad</label>
              <el-date-picker
                v-model="availabilityDate"
                type="date"
                placeholder="Seleccionar fecha"
                class="w-full"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :disabled="isReadOnly"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Rango Vigencia Promoción</label>
              <el-date-picker
                v-model="promotionDateRange"
                type="daterange"
                range-separator="a"
                start-placeholder="Inicio"
                end-placeholder="Fin"
                class="w-full"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :disabled="isReadOnly"
              />
            </div>
          </div>

          <div class="space-y-3 pt-2 border-t border-slate-200/60">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Garantía del Fabricante</label>
              <el-input v-model="warrantyInformation" placeholder="1 año de garantía oficial" :disabled="isReadOnly" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Información de Envío</label>
              <el-input v-model="shippingInformation" placeholder="Envío estándar express" :disabled="isReadOnly" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Política de Devolución</label>
              <el-input v-model="returnPolicy" placeholder="30 días de devolución sin costo" :disabled="isReadOnly" />
            </div>
          </div>
        </div>

        <!-- Section 7: Upload & Image Gallery -->
        <div class="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <UploadCloud class="w-3.5 h-3.5" />
            </div>
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
              class="w-full"
            >
              <div class="flex flex-col items-center justify-center text-slate-500 py-3">
                <Plus class="w-7 h-7 mb-1 text-slate-400" />
                <span class="text-xs font-bold">Arrastrar imágenes o hacer clic para cargar</span>
              </div>
            </el-upload>
          </div>

          <!-- Custom Image Gallery Preview List -->
          <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div
              v-for="img in images"
              :key="img.id"
              class="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square shadow-2xs"
            >
              <img :src="img.url" :alt="img.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  class="p-2 rounded-full bg-white/90 text-slate-800 hover:text-blue-600 transition-colors shadow-md"
                  @click="handlePreviewImage(img.url)"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  v-if="!isReadOnly"
                  type="button"
                  class="p-2 rounded-full bg-white/90 text-red-600 hover:bg-red-50 transition-colors shadow-md"
                  @click="handleRemoveImage(img.id)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 text-center py-6">
            No hay imágenes cargadas aún para este producto.
          </p>
        </div>
      </div>

      <!-- Sticky Footer Actions -->
      <div class="flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-t border-slate-200/80 flex-shrink-0">
        <span class="text-xs text-slate-500">
          <span v-if="meta.dirty" class="text-amber-600 font-bold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Cambios sin guardar
          </span>
        </span>

        <div class="flex items-center gap-3">
          <el-button size="default" class="!rounded-xl" @click="handleClose">
            {{ isReadOnly ? 'Cerrar' : 'Cancelar' }}
          </el-button>

          <el-button
            v-if="!isReadOnly"
            type="primary"
            size="default"
            class="!rounded-xl !px-5 font-bold"
            :loading="isSubmitting"
            @click="onSubmit"
          >
            {{ isEditMode ? 'Guardar Cambios' : 'Registrar Producto' }}
          </el-button>
        </div>
      </div>
    </form>

    <!-- Image Modal Preview -->
    <el-dialog v-model="previewVisible" title="Vista Previa de Imagen" width="500px" append-to-body class="!rounded-2xl">
      <img :src="previewUrl" alt="Preview" class="w-full h-auto rounded-xl shadow-md" />
    </el-dialog>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef } from 'vue'
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
  ShieldCheck,
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
  const cat = category.value
  if (!cat) return []
  const slug = typeof cat === 'string' ? cat.toLowerCase() : ''
  if (CATEGORY_SUBCATEGORY_MAP[slug]) {
    return CATEGORY_SUBCATEGORY_MAP[slug]
  }
  if (CATEGORY_SUBCATEGORY_MAP[cat]) {
    return CATEGORY_SUBCATEGORY_MAP[cat]
  }
  const formatted = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')
  return [`${formatted} General`, `${formatted} Premium`, `${formatted} Accesorios`]
})

watch(category, (newCat, oldCat) => {
  if (newCat !== oldCat && oldCat !== undefined) {
    if (subcategory.value && !availableSubcategories.value.includes(subcategory.value)) {
      subcategory.value = ''
    }
  }
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
