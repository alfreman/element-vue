export interface PaginationParams {
  limit: number
  skip: number
}

export interface PaginatedResponse<T> {
  total: number
  skip: number
  limit: number
  items: T[]
}

export interface SelectOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

export interface ApiErrorResponse {
  message: string
  statusCode?: number
  error?: string
}
