<template>
  <div class="py-12 px-4 text-center flex flex-col items-center justify-center bg-white rounded-lg border border-dashed border-gray-300">
    <el-empty :description="description">
      <template #image>
        <div class="w-16 h-16 mx-auto mb-2 text-gray-400 flex items-center justify-center bg-gray-100 rounded-full">
          <slot name="icon">
            <PackageSearch class="w-8 h-8 text-gray-400" />
          </slot>
        </div>
      </template>
      <template #default>
        <div class="mt-2">
          <slot name="actions" />
        </div>
      </template>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { PackageSearch } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    description?: string
  }>(),
  {
    description: 'No se encontraron registros',
  }
)
</script>
