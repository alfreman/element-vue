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
  beauty: ['Maquillaje', 'Cuidado Facial', 'Fragancias', 'Cuidado Capilar'],
  fragrances: ['Perfumes Hombre', 'Perfumes Mujer', 'Colonia Unisex', 'Aromaterapia'],
  furniture: ['Salón', 'Dormitorio', 'Oficina', 'Comedor', 'Exterior'],
  groceries: ['Bebidas', 'Snacks', 'Lácteos', 'Conservas', 'Orgánicos'],
  'home-decoration': ['Iluminación', 'Cuadros y Arte', 'Espejos', 'Alfombras', 'Velas'],
  'kitchen-accessories': ['Menaje', 'Sartenes y Ollas', 'Utensilios', 'Organizadores'],
  laptops: ['Gaming', 'Ultrabooks', 'Trabajo/Oficina', 'Convertibles 2 en 1'],
  'mens-shirts': ['Camisas Formales', 'Camisas Casuales', 'Polos', 'Guayaberas'],
  'mens-shoes': ['Zapatos Formales', 'Deportivos', 'Botas', 'Mocasines'],
  'mens-watches': ['Análogos', 'Digitales', 'Cronógrafos', 'Smartwatches'],
  'mobile-accessories': ['Fundas y Carcasas', 'Cargadores', 'Cables', 'Protectores de Pantalla'],
  motorcycle: ['Cascos', 'Chaquetas', 'Guantes', 'Repuestos'],
  'skin-care': ['Limpiadores', 'Hidratantes', 'Serums', 'Mascarillas', 'Protector Solar'],
  smartphones: ['Alta Gama', 'Gama Media', 'Accesorios Movilidad', 'Teléfonos Rugerizados'],
  'sports-accessories': ['Equipamiento', 'Botellas', 'Bolsas de Deporte', 'Cintas'],
  sunglasses: ['Polarizadas', 'Deportivas', 'Moda', 'Lectura'],
  tablets: ['Tablets Android', 'iPads', 'Accesorios Stylus'],
  tops: ['Blusas', 'Camisetas', 'Tops Deportivos', 'Túnicas'],
  'womens-bags': ['Bolsos de Mano', 'Mochilas', 'Carteras', 'Bolsos de Hombro'],
  'womens-dresses': ['Vestidos de Noche', 'Casual', 'Fiesta', 'Verano'],
  'womens-jewellery': ['Collares', 'Anillos', 'Pulseras', 'Pendientes'],
  'womens-shoes': ['Tacones', 'Sandalias', 'Deportivos', 'Botines'],
  'womens-watches': ['Elegantes', 'Casual', 'Deportivos', 'Smartwatches'],
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
