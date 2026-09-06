import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { productFormSchema } from '../schemas/product.schema'
import { mapProductToForm, getDefaultFormValues } from '../utils/product.utils'
import type { Product, ProductFormValues } from '../types/product.types'
import { watch, type Ref } from 'vue'

export const useProductForm = (productProp?: Ref<Product | null | undefined>) => {
  const formSchema = toTypedSchema(productFormSchema)

  const {
    handleSubmit,
    resetForm,
    errors,
    values,
    meta,
    setFieldValue,
    setValues,
    defineField,
  } = useForm<ProductFormValues>({
    validationSchema: formSchema,
    initialValues: getDefaultFormValues(),
  })

  // Watch for changes in productProp to reset form state cleanly
  if (productProp) {
    watch(
      productProp,
      (newProduct) => {
        if (newProduct) {
          resetForm({
            values: mapProductToForm(newProduct),
          })
        } else {
          resetForm({
            values: getDefaultFormValues(),
          })
        }
      },
      { immediate: true }
    )
  }

  // Bind VeeValidate defined fields for 2-way v-model binding
  const [title] = defineField('title')
  const [description] = defineField('description')
  const [category] = defineField('category')
  const [subcategory] = defineField('subcategory')
  const [brand] = defineField('brand')
  const [sku] = defineField('sku')
  const [price] = defineField('price')
  const [discountPercentage] = defineField('discountPercentage')
  const [rating] = defineField('rating')
  const [stock] = defineField('stock')
  const [minimumOrderQuantity] = defineField('minimumOrderQuantity')
  const [availabilityStatus] = defineField('availabilityStatus')
  const [warrantyInformation] = defineField('warrantyInformation')
  const [shippingInformation] = defineField('shippingInformation')
  const [returnPolicy] = defineField('returnPolicy')
  const [weight] = defineField('weight')
  const [width] = defineField('width')
  const [height] = defineField('height')
  const [depth] = defineField('depth')
  const [isFeatured] = defineField('isFeatured')
  const [isNew] = defineField('isNew')
  const [isOnSale] = defineField('isOnSale')
  const [allowReturn] = defineField('allowReturn')
  const [availabilityDate] = defineField('availabilityDate')
  const [promotionDateRange] = defineField('promotionDateRange')

  return {
    handleSubmit,
    resetForm,
    errors,
    values,
    meta,
    setFieldValue,
    setValues,
    defineField,
    // Individual defined fields
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
  }
}
