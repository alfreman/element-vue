import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import ProductsPage from '@/features/products/pages/ProductsPage.vue'
import PlaceholderPage from '@/pages/PlaceholderPage.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage,
        meta: { title: 'Dashboard' },
      },
      {
        path: 'products',
        name: 'Products',
        component: ProductsPage,
        meta: { title: 'Productos' },
      },
      {
        path: 'categories',
        name: 'Categories',
        component: PlaceholderPage,
        meta: {
          title: 'Categorías',
          description: 'Gestión de categorías y familias de producto',
        },
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: PlaceholderPage,
        meta: {
          title: 'Inventario',
          description: 'Control de existencias y movimientos de almacén',
        },
      },
      {
        path: 'customers',
        name: 'Customers',
        component: PlaceholderPage,
        meta: {
          title: 'Clientes',
          description: 'Directorio de clientes y segmentos',
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: PlaceholderPage,
        meta: {
          title: 'Configuración',
          description: 'Ajustes del sistema y parámetros generales',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  const pageTitle = to.meta.title ? `${to.meta.title} | Admin ERP` : 'Admin ERP'
  document.title = pageTitle
})

export default router
