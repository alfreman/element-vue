<template>
  <el-tag
    :type="tagType"
    :effect="effect"
    size="small"
    class="font-medium px-2.5 py-0.5 rounded-full"
  >
    <span class="flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full" :class="dotColor"></span>
      {{ statusLabel }}
    </span>
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    status?: string
    stock?: number
    effect?: 'dark' | 'light' | 'plain'
  }>(),
  {
    status: 'Activo',
    stock: 10,
    effect: 'light',
  }
)

const statusLabel = computed(() => {
  if (props.stock === 0) return 'Agotado'
  return props.status || 'Activo'
})

const tagType = computed(() => {
  if (props.stock === 0) return 'danger'
  switch (props.status) {
    case 'Activo':
    case 'In Stock':
      return 'success'
    case 'Inactivo':
    case 'Out of Stock':
      return 'danger'
    case 'Borrador':
    case 'Low Stock':
      return 'warning'
    default:
      return 'info'
  }
})

const dotColor = computed(() => {
  if (props.stock === 0) return 'bg-red-500'
  switch (props.status) {
    case 'Activo':
    case 'In Stock':
      return 'bg-emerald-500'
    case 'Inactivo':
    case 'Out of Stock':
      return 'bg-red-500'
    case 'Borrador':
    case 'Low Stock':
      return 'bg-amber-500'
    default:
      return 'bg-gray-400'
  }
})
</script>
