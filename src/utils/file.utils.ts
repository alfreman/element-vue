/**
 * Validate image file size in megabytes
 */
export const validateFileSize = (file: File, maxMb = 5): boolean => {
  const maxBytes = maxMb * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Validate image file extension against allowed types
 */
export const validateFileExtension = (file: File, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']): boolean => {
  return allowedTypes.includes(file.type)
}

/**
 * Create temporary Blob preview URL for local File object
 */
export const createBlobPreview = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * Revoke Blob preview URL to avoid memory leaks
 */
export const revokeBlobPreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}
