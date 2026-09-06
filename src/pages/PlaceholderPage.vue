<template>
  <div class="space-y-6">
    <AppPageHeader :title="title" :description="description">
      <template #icon>
        <component :is="icon" class="w-6 h-6 text-brand-600" />
      </template>
    </AppPageHeader>

    <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <AppEmptyState description="Módulo próximamente disponible">
        <template #actions>
          <p class="text-sm text-gray-500 max-w-md mx-auto mb-4">
            Este módulo se encuentra en roadmap para la siguiente fase de integración con la API de NestJS Backend.
          </p>
          <router-link to="/products">
            <el-button type="primary">
              Ir a Módulo de Productos
            </el-button>
          </router-link>
        </template>
      </AppEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Tags, Boxes, Users, Settings, Construction } from 'lucide-vue-next'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'

const route = useRoute()

const title = computed(() => (route.meta.title as string) || 'Módulo')
const description = computed(() => (route.meta.description as string) || 'Sección en desarrollo')

const icon = computed(() => {
  switch (route.name) {
    case 'Categories':
      return Tags
    case 'Inventory':
      return Boxes
    case 'Customers':
      return Users
    case 'Settings':
      return Settings
    default:
      return Construction
  }
})
</script>
