export const PRODUCT_STATUS_OPTIONS = [
  { label: 'Todos', value: 'all' },
  { label: 'Activo', value: 'Activo' },
  { label: 'Inactivo', value: 'Inactivo' },
  { label: 'Borrador', value: 'Borrador' },
]

export const PRODUCT_AVAILABILITY_OPTIONS = [
  { label: 'En Stock', value: 'In Stock' },
  { label: 'Bajo Stock', value: 'Low Stock' },
  { label: 'Agotado', value: 'Out of Stock' },
]

export const CATEGORY_SUBCATEGORY_MAP: Record<string, string[]> = {
  beauty: ['Maquillaje', 'Cuidado de la Piel', 'Fragancias', 'Cuidado Capilar'],
  fragrances: ['Perfumes Hombre', 'Perfumes Mujer', 'Colonia Unisex'],
  furniture: ['Salón', 'Dormitorio', 'Oficina', 'Comedor'],
  groceries: ['Bebidas', 'Snacks', 'Lácteos', 'Conservas'],
  smartphones: ['Alta Gama', 'Gama Media', 'Accesorios Movilidad', 'Teléfonos Rugerizados'],
  laptops: ['Gaming', 'Ultrabooks', 'Trabajo/Oficina', 'Convertibles 2 en 1'],
  tablets: ['Tablets Android', 'iPads', 'Accesorios Stylus'],
}

export const BRAND_SUGGESTIONS = [
  'Apple',
  'Samsung',
  'Beauty Elegance',
  'Essence',
  'Glamour',
  'Sony',
  'Dell',
  'HP',
  'Lenovo',
  'Logitech',
  'Nike',
  'Adidas',
]

export const DEFAULT_PAGE_SIZES = [5, 10, 20, 50]
