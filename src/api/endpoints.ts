export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/products/search',
    BY_ID: (id: number | string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    ADD: '/products/add',
    UPDATE: (id: number | string) => `/products/${id}`,
    DELETE: (id: number | string) => `/products/${id}`,
  },
} as const
