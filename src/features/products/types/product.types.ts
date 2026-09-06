export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductDimensions {
  width: number
  height: number
  depth: number
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  sku?: string
  weight?: number
  dimensions?: ProductDimensions
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus?: string
  reviews?: ProductReview[]
  returnPolicy?: string
  minimumOrderQuantity?: number
  images: string[]
  thumbnail: string
}

export interface ProductCategory {
  slug: string
  name: string
  url: string
}

export interface ProductFilters {
  search?: string
  category?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStockOnly?: boolean
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page: number
  pageSize: number
}

export interface ProductFormValues {
  id?: number
  title: string
  description: string
  category: string
  subcategory?: string
  brand: string
  sku: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  minimumOrderQuantity: number
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Activo' | 'Inactivo' | 'Borrador'
  warrantyInformation: string
  shippingInformation: string
  returnPolicy: string
  weight: number
  width: number
  height: number
  depth: number
  isFeatured: boolean
  isNew: boolean
  isOnSale: boolean
  allowReturn: boolean
  availabilityDate: string | Date | null
  promotionDateRange: [string | Date, string | Date] | null
  images: string[]
  thumbnail: string
}

export interface CreateProductPayload {
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand?: string
  sku?: string
  weight?: number
  dimensions?: ProductDimensions
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus?: string
  returnPolicy?: string
  minimumOrderQuantity?: number
  images: string[]
  thumbnail: string
}

export type UpdateProductPayload = Partial<CreateProductPayload>

export interface ProductListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
