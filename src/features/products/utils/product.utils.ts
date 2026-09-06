import type {
  Product,
  ProductFormValues,
  CreateProductPayload,
  UpdateProductPayload,
} from '../types/product.types'

export const getDefaultFormValues = (): ProductFormValues => ({
  title: '',
  description: '',
  category: '',
  subcategory: '',
  brand: '',
  sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
  price: 99.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 25,
  minimumOrderQuantity: 1,
  availabilityStatus: 'Activo',
  warrantyInformation: '1 año de garantía de fábrica',
  shippingInformation: 'Envío estándar en 3 a 5 días hábiles',
  returnPolicy: '30 días de devolución sin costo',
  weight: 0.5,
  width: 10,
  height: 15,
  depth: 5,
  isFeatured: false,
  isNew: true,
  isOnSale: false,
  allowReturn: true,
  availabilityDate: new Date(),
  promotionDateRange: null,
  images: [],
  thumbnail: '',
})

export const mapProductToForm = (product: Product): ProductFormValues => ({
  id: product.id,
  title: product.title || '',
  description: product.description || '',
  category: product.category || '',
  subcategory: '',
  brand: product.brand || 'Marca Genérica',
  sku: product.sku || `SKU-${product.id}`,
  price: product.price || 0,
  discountPercentage: product.discountPercentage || 0,
  rating: product.rating || 0,
  stock: product.stock || 0,
  minimumOrderQuantity: product.minimumOrderQuantity || 1,
  availabilityStatus: (product.availabilityStatus as any) || 'Activo',
  warrantyInformation: product.warrantyInformation || 'Sin información',
  shippingInformation: product.shippingInformation || 'Envío estándar',
  returnPolicy: product.returnPolicy || 'Sin política',
  weight: product.weight || 0.5,
  width: product.dimensions?.width || 10,
  height: product.dimensions?.height || 15,
  depth: product.dimensions?.depth || 5,
  isFeatured: (product.rating || 0) >= 4.5,
  isNew: false,
  isOnSale: (product.discountPercentage || 0) > 0,
  allowReturn: true,
  availabilityDate: new Date(),
  promotionDateRange: null,
  images: product.images ? [...product.images] : [],
  thumbnail: product.thumbnail || (product.images && product.images[0]) || '',
})

export const mapFormToCreatePayload = (form: ProductFormValues): CreateProductPayload => {
  const defaultImage = 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png'
  const images = form.images && form.images.length > 0 ? form.images : [defaultImage]
  const thumbnail = form.thumbnail || images[0]

  return {
    title: form.title,
    description: form.description,
    category: form.category,
    price: form.price,
    discountPercentage: form.discountPercentage,
    rating: form.rating,
    stock: form.stock,
    brand: form.brand,
    sku: form.sku,
    weight: form.weight,
    dimensions: {
      width: form.width,
      height: form.height,
      depth: form.depth,
    },
    warrantyInformation: form.warrantyInformation,
    shippingInformation: form.shippingInformation,
    availabilityStatus: form.availabilityStatus,
    returnPolicy: form.returnPolicy,
    minimumOrderQuantity: form.minimumOrderQuantity,
    images,
    thumbnail,
  }
}

export const mapFormToUpdatePayload = (form: ProductFormValues): UpdateProductPayload =>
  mapFormToCreatePayload(form)
