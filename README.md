# Vue 3 Admin ERP/POS — Módulo de Productos

Demostración técnica profesional de un módulo administrativo de gestión de catálogo de productos para sistemas **ERP / POS**, construida con **Vue 3 (Composition API)**, **TypeScript**, **Vite**, **Element Plus**, **Tailwind CSS**, **TanStack Table**, **TanStack Query**, **VeeValidate**, **Zod** y **Axios**.

---

## 🚀 Arquitectura y Objetivos

Esta aplicación demuestra una arquitectura **feature-oriented** altamente modular y escalable. La separación estricta entre capa visual, lógica de negocio y acceso a datos permite reemplazar la API de demostración por un backend empresarial en **NestJS** sin alterar los componentes de interfaz.

### Flujo de Datos Arquitectónico

```text
Page (ProductsPage / DashboardPage)
   │
   ├── UI Components (ProductFilters, ProductTable, ProductFormDrawer)
   │     │
   │     ├── Form Logic & Validation (useProductForm, VeeValidate + Zod Schema)
   │     └── Table Logic (TanStack Table: sorting, pagination, row selection)
   │
   ├── Composables (useProducts, useProductForm, useImagePreview, useDebounce)
   │     │
   │     └── TanStack Vue Query (Query caching, loading, errors, invalidation)
   │           │
   │           └── API Services (products.api.ts, categories.api.ts)
   │                 │
   │                 └── Axios HTTP Client (client.ts + interceptors)
   │                       │
   │                       └── API Endpoint (DummyJSON / NestJS Backend)
```

---

## 🛠️ Tecnologías Utilizadas

- **Core**: Vue 3 (Composition API, `<script setup lang="ts">`), TypeScript (Strict Mode).
- **Build Tool**: Vite.
- **UI Framework**: Element Plus (Componentes funcionales).
- **Styling**: Tailwind CSS (Layout, Flex, Grid, Spacing, Responsive).
- **Data Table**: `@tanstack/vue-table` v8.
- **Server State & Cache**: `@tanstack/vue-query` v5.
- **Form Validations**: VeeValidate + Zod (`@vee-validate/zod`).
- **HTTP Client**: Axios.
- **Routing**: Vue Router.
- **Iconos**: Lucide Vue Next & `@element-plus/icons-vue`.

---

## 📦 Instalación y Ejecución

### Requisitos Previos
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Clonar e Instalar Dependencias

```bash
npm install
```

### 2. Variables de Entorno

Copie el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Contenido del archivo `.env`:

```env
VITE_API_BASE_URL=https://dummyjson.com
```

### 3. Modo Desarrollo

```bash
npm run dev
```

La aplicación se iniciará en `http://localhost:3000`.

### 4. Verificación de Tipos (TypeScript Check)

```bash
npm run type-check
```

### 5. Compilación para Producción (Build)

```bash
npm run build
```

### 6. Vista Previa de Producción (Preview)

```bash
npm run preview
```

---

## 🧩 Componentes Element Plus Utilizados

| Componente | Uso Principal en la Aplicación |
| :--- | :--- |
| `ElContainer` / `ElAside` / `ElHeader` / `ElMain` | Estructura principal del Layout administrativo |
| `ElMenu` / `ElMenuItem` / `ElSubMenu` | Navegación lateral con soporte para colapsar/expandir |
| `ElBreadcrumb` / `ElBreadcrumbItem` | Miga de pan en cabecera superior (`AppHeader`) |
| `ElDrawer` | Formulario lateral deslizable para Crear/Editar/Ver productos |
| `ElDialog` | Modal de vista previa ampliada de imágenes subidas |
| `ElInput` | Campos de texto estándar, SKU y descripciones |
| `ElTextarea` | Campo multilinea de descripción con contador |
| `ElInputNumber` | Control numérico con botones para Precio, Stock, Peso y Dimensiones |
| `ElSelect` / `ElOption` | Selects simples y filtrables para categorías y estado |
| `ElCascader` / `ElAutocomplete` | Autocompletado de marcas y búsqueda sugerida |
| `ElCheckbox` / `ElCheckboxGroup` | Filtro "Solo con stock" y marcas de destacados/ofertas |
| `ElRadioGroup` / `ElRadioButton` | Selección exclusiva de estado (Activo, Inactivo, Borrador) |
| `ElSwitch` | Interruptores de activación rápida |
| `ElSlider` | Sliders de rango continuo de precios ($0 - $2000) y rating (0 - 5.0) |
| `ElDatePicker` | Selección de fecha de disponibilidad y rango de vigencia de promoción |
| `ElUpload` | Zona Drag & Drop y cuadro de carga múltiple de imágenes de producto |
| `ElImage` | Visualización de thumbnails en tabla con preview modal al hacer clic |
| `ElPagination` | Barra de paginación de la tabla con selector de tamaño de página |
| `ElDropdown` / `ElDropdownMenu` | Menú desplegable de perfil de usuario y acciones de fila (Ver, Editar, Eliminar) |
| `ElTooltip` | Ayuda flotante informativa en botones e iconos |
| `ElTag` | Badges de categoría, descuentos y estados de inventario |
| `ElBadge` | Indicador numérico de notificaciones en el header |
| `ElAvatar` | Foto del usuario administrador |
| `ElSkeleton` | Indicador visual de carga durante el fetching de datos |
| `ElEmpty` | Estado vacío cuando no existen registros coincidentes |
| `ElAlert` | Banner de error con botón de reintento |
| `ElStatistic` | Métricas numéricas del Dashboard de catálogo |
| `ElProgress` | Barras de progreso de salud de inventario en el Dashboard |
| `ElMessage` | Toasts informativos de éxito o error en operaciones CRUD |
| `ElMessageBox` | Diálogos modales de confirmación para eliminar o descartar cambios sin guardar |

---

## ⚡ TanStack Query vs. TanStack Table

### `@tanstack/vue-query` (Gestión del Estado del Servidor)
Responsable de:
- **Fetching**: Obtención de productos y categorías desde la API HTTP.
- **Cache**: Almacenamiento en memoria con política de `staleTime`.
- **Loading & Error**: Control automático de flags `isLoading`, `isError`, `error`.
- **Mutations**: Manejo asíncrono de operaciones POST, PUT y DELETE.
- **Invalidation**: Invocación de `queryClient.invalidateQueries(['products'])` tras crear, editar o eliminar registros para actualizar la interfaz.

### `@tanstack/vue-table` (Lógica de Presentación de Tabla)
Responsable de:
- **Columns**: Definición fuertemente tipada de columnas (`createColumnHelper`).
- **Sorting**: Ordenamiento por columnas (ascendente / descendente).
- **Row Selection**: Manejo del estado de selección múltiple por checkboxes.
- **Pagination**: Cálculo de filas visibles y estado de paginación.
- **Aislamiento**: Toda la lógica de la tabla se encapsula en `ProductTable.vue` sin sobrecargar la página principal.

---

## 🔄 Flujo CRUD Detallado

```text
[LECTURA - GET]
GET /products (con skip, limit y búsqueda)
      ↓
TanStack Query (useProductsQuery)
      ↓
ProductTable.vue (Renderizado con TanStack Table)

[CREACIÓN - POST]
Boton "+ Nuevo producto"
      ↓
ProductFormDrawer (Product = null)
      ↓
Validación Zod + VeeValidate (useProductForm)
      ↓
Mutation (useCreateProductMutation)
      ↓
POST /products/add
      ↓
invalidateQueries(['products']) + Toast ElMessage.success

[EDICIÓN - PUT/PATCH]
Acción "Editar" en fila
      ↓
ProductFormDrawer (Product via prop)
      ↓
Mapeo de datos (mapProductToForm)
      ↓
Mutation (useUpdateProductMutation)
      ↓
PUT /products/{id}
      ↓
invalidateQueries(['products']) + Toast ElMessage.success

[ELIMINACIÓN - DELETE]
Acción "Eliminar" en fila
      ↓
ElMessageBox.confirm() ("¿Eliminar producto?")
      ↓
Mutation (useDeleteProductMutation)
      ↓
DELETE /products/{id}
      ↓
invalidateQueries(['products']) + Toast ElMessage.success
```

---

## 📑 Validación de Formularios (VeeValidate + Zod)

Las reglas de validación están definidas formalmente en `src/features/products/schemas/product.schema.ts`:

- `title`: Requerido, entre 3 y 100 caracteres.
- `description`: Requerida, mínimo 10 caracteres.
- `category`: Requerida.
- `brand`: Requerida, mínimo 2 caracteres.
- `sku`: Requerido, mínimo 3 caracteres.
- `price`: Numérico strictly mayor a 0.
- `discountPercentage`: Numérico entre 0% y 100%.
- `rating`: Numérico entre 0.0 y 5.0.
- `stock`: Entero mayor o igual a 0.
- `minimumOrderQuantity`: Entero mayor o igual a 1.
- `weight` / `dimensions`: Números no negativos.

---

## 🔌 Guía para Reemplazar DummyJSON por Backend NestJS

Para conectar esta demo con una API real construida en **NestJS**:

### 1. Actualizar Variable de Entorno
Modifique `.env`:
```env
VITE_API_BASE_URL=https://api.tu-dominio-nestjs.com/api/v1
```

### 2. Inyectar Token JWT de Autenticación
En `src/api/client.ts`, desactive las líneas comentadas del interceptor de peticiones:
```ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 3. Ajustar DTOs de Mapeo (Si aplica)
Si los nombres de campo en NestJS varían ligeramente (ej. `discount_percentage` en lugar de `discountPercentage`), actualice las funciones puras en `src/features/products/utils/product.utils.ts`:
- `mapProductToForm()`
- `mapFormToCreatePayload()`
- `mapFormToUpdatePayload()`

Ningún componente visual (`ProductTable.vue`, `ProductFormDrawer.vue`, `ProductsPage.vue`) necesitará ser modificado.

---

## 📂 Estructura Completa del Proyecto

```text
src/
│
├── api/                          # Configuración HTTP Global
│   ├── client.ts                 # Instancia de Axios e interceptores globales
│   └── endpoints.ts              # Constantes de endpoints de la aplicación
│
├── components/                   # Componentes Globales Reutilizables
│   ├── common/                   # Componentes UI UI de propósito general
│   │   ├── AppPageHeader.vue
│   │   ├── AppEmptyState.vue
│   │   ├── AppLoading.vue
│   │   └── AppErrorState.vue
│   └── layout/                   # Layout administrativo principal
│       ├── AppSidebar.vue
│       ├── AppHeader.vue
│       └── AppLayout.vue
│
├── composables/                  # Composables Genéricos / Globales
│   └── useDebounce.ts            # Hook de debounce reutilizable
│
├── features/                     # Arquitectura Basada en Características (Feature-Driven)
│   └── products/                 # TODO lo específico del Módulo de Productos
│       ├── api/                  # Peticiones API del módulo de productos y catálogo
│       │   ├── products.api.ts
│       │   └── categories.api.ts
│       │
│       ├── components/           # Componentes visuales específicos de productos
│       │   ├── ProductTable.vue  # Tabla TanStack Table + Element Plus
│       │   ├── ProductFilters.vue# Panel de filtros avanzados
│       │   ├── ProductFormDrawer.vue # Drawer de creación / edición
│       │   └── ProductStatus.vue # Tag de estado e inventario
│       │
│       ├── composables/          # Hooks y lógica reactiva exclusiva de productos
│       │   ├── useProducts.ts    # Integración con TanStack Query
│       │   ├── useProductForm.ts # Integración con VeeValidate + Zod
│       │   └── useImagePreview.ts# Lógica de carga y preview de imágenes
│       │
│       ├── pages/                # Páginas / Vistas del módulo de productos
│       │   └── ProductsPage.vue  # Vista principal del catálogo de productos
│       │
│       ├── schemas/              # Validaciones Zod de productos
│       │   └── product.schema.ts
│       │
│       ├── types/                # Tipos e interfaces TypeScript de productos
│       │   └── product.types.ts
│       │
│       └── utils/                # Helpers y mapeadores de productos
│           └── product.utils.ts
│
├── pages/                        # Páginas Generales de Navegación
│   ├── DashboardPage.vue         # Métricas e indicadores clave de rendimiento
│   └── PlaceholderPage.vue       # Vista placeholder para módulos futuros
│
├── router/
│   └── index.ts                  # Configuración de Vue Router
├── types/
│   └── common.types.ts           # Tipos globales de respuesta y paginación
├── utils/                        # Utilidades Genéricas Puras
│   ├── formatters.ts             # Formateadores (moneda, fechas, números)
│   ├── constants.ts              # Opciones y mapeos estáticos
│   └── file.utils.ts             # Utilidades de archivos e imágenes
│
├── App.vue                       # Componente raíz
├── main.ts                       # Entrypoint con plugins
└── style.css                     # Estilos globales y Tailwind CSS
```
