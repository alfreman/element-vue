<template>
  <div class="my-6">
    <el-alert
      :title="title"
      :description="message"
      type="error"
      show-icon
      :closable="false"
    >
      <template #default>
        <div class="mt-3 flex items-center gap-2">
          <el-button type="danger" size="small" plain @click="$emit('retry')">
            <template #icon>
              <RefreshCw class="w-4 h-4 animate-spin-hover" />
            </template>
            Reintentar
          </el-button>
        </div>
      </template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Ocurrió un error al cargar la información',
    message: 'Por favor verifique su conexión e intente de nuevo.',
  }
)

defineEmits<{
  (e: 'retry'): void
}>()
</script>
