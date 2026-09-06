/**
 * Format number as currency string (e.g. $1,234.56)
 */
export const formatCurrency = (value: number | undefined | null, currency = 'USD', locale = 'en-US'): string => {
  if (value === undefined || value === null || isNaN(value)) return '$0.00'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format ISO date string or Date object to readable date string
 */
export const formatDate = (dateStr: string | Date | null | undefined, locale = 'es-ES'): string => {
  if (!dateStr) return '-'
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    if (isNaN(d.getTime())) return '-'
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d)
  } catch {
    return '-'
  }
}

/**
 * Format number with localized thousand separators
 */
export const formatNumber = (value: number | undefined | null, locale = 'es-ES'): string => {
  if (value === undefined || value === null || isNaN(value)) return '0'
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format decimal value to percentage string (e.g. 15.5%)
 */
export const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0%'
  return `${value.toFixed(1)}%`
}
