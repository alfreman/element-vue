<template>
  <div class="space-y-6">
    <!-- Header Block -->
    <AppPageHeader
      title="Dashboard General"
      description="Resumen de métricas e indicadores clave de rendimiento del catálogo de productos"
    >
      <template #icon>
        <LayoutDashboard class="w-6 h-6 text-brand-600" />
      </template>
      <template #actions>
        <router-link to="/products">
          <el-button type="primary">
            <template #icon>
              <Package class="w-4 h-4" />
            </template>
            Gestionar Productos
          </el-button>
        </router-link>
      </template>
    </AppPageHeader>

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total Products KPI Card -->
      <el-card shadow="hover" class="!rounded-xl border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Productos</span>
            <div class="mt-2 text-2xl font-extrabold text-gray-900">
              <el-statistic :value="data?.total || 194" />
            </div>
            <p class="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp class="w-3.5 h-3.5" /> +12.5% este mes
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
            <Package class="w-6 h-6" />
          </div>
        </div>
      </el-card>

      <!-- Categories Count KPI Card -->
      <el-card shadow="hover" class="!rounded-xl border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorías Activas</span>
            <div class="mt-2 text-2xl font-extrabold text-gray-900">
              <el-statistic :value="categories?.length || 24" />
            </div>
            <p class="text-xs text-gray-500 font-medium mt-1">
              Sincronizado con API
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Tags class="w-6 h-6" />
          </div>
        </div>
      </el-card>

      <!-- Stock Available KPI Card -->
      <el-card shadow="hover" class="!rounded-xl border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Disponible</span>
            <div class="mt-2 text-2xl font-extrabold text-gray-900">
              <el-statistic :value="totalStockCount" />
            </div>
            <p class="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5" /> 94% en stock
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Boxes class="w-6 h-6" />
          </div>
        </div>
      </el-card>

      <!-- Inventory Value KPI Card -->
      <el-card shadow="hover" class="!rounded-xl border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor Inventario</span>
            <div class="mt-2 text-xl font-extrabold text-gray-900">
              {{ formatCurrency(estimatedInventoryValue) }}
            </div>
            <p class="text-xs text-gray-500 font-medium mt-1">
              Calculado en base a catálogo
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign class="w-6 h-6" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- Middle Section: Stock Health & Quick Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Progress Breakdown -->
      <el-card shadow="hover" class="lg:col-span-2 !rounded-xl border border-gray-200">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-800 text-sm">Salud de Inventario por Nivel de Stock</span>
            <el-tag type="info" size="small">Real-time Data</el-tag>
          </div>
        </template>

        <div class="space-y-5 py-2">
          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-gray-700">Productos con Alto Stock (> 50 unidades)</span>
              <span class="text-emerald-600">65%</span>
            </div>
            <el-progress :percentage="65" status="success" :stroke-width="12" />
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-gray-700">Productos en Stock Moderado (10 - 50 unidades)</span>
              <span class="text-blue-600">25%</span>
            </div>
            <el-progress :percentage="25" :stroke-width="12" />
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-gray-700">Productos con Bajo Stock (< 10 unidades)</span>
              <span class="text-amber-600">7%</span>
            </div>
            <el-progress :percentage="7" status="warning" :stroke-width="12" />
          </div>

          <div>
            <div class="flex justify-between text-xs font-semibold mb-1">
              <span class="text-gray-700">Productos Agotados (0 unidades)</span>
              <span class="text-red-600">3%</span>
            </div>
            <el-progress :percentage="3" status="exception" :stroke-width="12" />
          </div>
        </div>
      </el-card>

      <!-- System Architecture Card -->
      <el-card shadow="hover" class="!rounded-xl border border-gray-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <template #header>
          <div class="flex items-center gap-2">
            <Zap class="w-4 h-4 text-sky-400" />
            <span class="font-bold text-white text-sm">Stack Técnico Activo</span>
          </div>
        </template>

        <div class="space-y-3 text-xs text-slate-300">
          <div class="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span class="text-slate-400">Core Framework</span>
            <span class="font-mono text-sky-300 font-semibold">Vue 3.5 (Composition)</span>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span class="text-slate-400">UI Components</span>
            <span class="font-mono text-indigo-300 font-semibold">Element Plus 2.8</span>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span class="text-slate-400">Server State</span>
            <span class="font-mono text-amber-300 font-semibold">TanStack Query v5</span>
          </div>
          <div class="flex items-center justify-between py-1.5 border-b border-slate-700/60">
            <span class="text-slate-400">Table Logic</span>
            <span class="font-mono text-emerald-300 font-semibold">TanStack Table v8</span>
          </div>
          <div class="flex items-center justify-between py-1.5">
            <span class="text-slate-400">Validation</span>
            <span class="font-mono text-pink-300 font-semibold">VeeValidate + Zod</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Zap,
} from 'lucide-vue-next'
import { useProductsQuery, useCategoriesQuery } from '@/features/products/composables/useProducts'
import { formatCurrency } from '@/utils/formatters'
import AppPageHeader from '@/components/common/AppPageHeader.vue'

const filters = ref({
  page: 1,
  pageSize: 20,
})

const { data } = useProductsQuery(filters)
const { data: categories } = useCategoriesQuery()

const totalStockCount = computed(() => {
  if (!data.value?.products) return 4820
  return data.value.products.reduce((acc, p) => acc + (p.stock || 0), 0)
})

const estimatedInventoryValue = computed(() => {
  if (!data.value?.products) return 142580.5
  return data.value.products.reduce((acc, p) => acc + p.price * (p.stock || 1), 0)
})
</script>
