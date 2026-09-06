import { ref, onUnmounted } from 'vue'
import { createBlobPreview, revokeBlobPreview, validateFileSize, validateFileExtension } from '@/utils/file.utils'
import { ElMessage } from 'element-plus'

export interface UploadedImageFile {
  id: string
  name: string
  url: string
  file?: File
  isNew?: boolean
}

export const useImagePreview = (initialImages: string[] = []) => {
  const images = ref<UploadedImageFile[]>(
    initialImages.map((url, idx) => ({
      id: `existing-${idx}-${Date.now()}`,
      name: `Imagen ${idx + 1}`,
      url,
      isNew: false,
    }))
  )

  const previewVisible = ref(false)
  const previewUrl = ref('')

  const handleAddFile = (file: File): boolean => {
    if (!validateFileExtension(file)) {
      ElMessage.error('Formato no válido. Solo se permiten imágenes (JPG, PNG, WEBP, GIF).')
      return false
    }
    if (!validateFileSize(file, 5)) {
      ElMessage.error('La imagen no debe superar los 5MB.')
      return false
    }

    const blobUrl = createBlobPreview(file)
    images.value.push({
      id: `new-${Date.now()}-${Math.random()}`,
      name: file.name,
      url: blobUrl,
      file,
      isNew: true,
    })
    return true
  }

  const handleRemoveImage = (id: string): void => {
    const itemIndex = images.value.findIndex((img) => img.id === id)
    if (itemIndex !== -1) {
      const item = images.value[itemIndex]
      if (item.url && item.isNew) {
        revokeBlobPreview(item.url)
      }
      images.value.splice(itemIndex, 1)
    }
  }

  const handlePreviewImage = (url: string): void => {
    previewUrl.value = url
    previewVisible.value = true
  }

  const setInitialImages = (newUrls: string[]): void => {
    images.value.forEach((img) => {
      if (img.isNew && img.url) revokeBlobPreview(img.url)
    })
    images.value = newUrls.map((url, idx) => ({
      id: `existing-${idx}-${Date.now()}`,
      name: `Imagen ${idx + 1}`,
      url,
      isNew: false,
    }))
  }

  const clearAllImages = (): void => {
    images.value.forEach((img) => {
      if (img.isNew && img.url) revokeBlobPreview(img.url)
    })
    images.value = []
  }

  onUnmounted(() => {
    images.value.forEach((img) => {
      if (img.isNew && img.url) revokeBlobPreview(img.url)
    })
  })

  return {
    images,
    previewVisible,
    previewUrl,
    handleAddFile,
    handleRemoveImage,
    handlePreviewImage,
    setInitialImages,
    clearAllImages,
  }
}
