import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com'

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Inject auth header here when migrating to NestJS JWT authentication
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const formattedError = {
      message: error.response?.data?.message || error.message || 'Error de conexión con el servidor',
      statusCode: error.response?.status || 500,
      originalError: error,
    }
    return Promise.reject(formattedError)
  }
)
