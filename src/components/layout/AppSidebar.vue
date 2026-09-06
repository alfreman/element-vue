<template>
  <aside
    class="bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen sticky top-0 z-20 border-r border-slate-800 select-none"
    :class="[isCollapsed ? 'w-16' : 'w-64']"
  >
    <!-- Brand Logo Section -->
    <div class="h-16 flex items-center px-4 border-b border-slate-800 overflow-hidden bg-slate-950">
      <router-link to="/" class="flex items-center gap-3 w-full">
        <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
          <Box class="w-5 h-5" />
        </div>
        <div v-if="!isCollapsed" class="flex flex-col overflow-hidden">
          <span class="font-bold text-base tracking-wide text-slate-100 truncate">VUE ERP</span>
          <span class="text-[11px] text-blue-400 font-medium tracking-wider uppercase">Products Module</span>
        </div>
      </router-link>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto py-3 custom-sidebar-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        background-color="#0f172a"
        text-color="#94a3b8"
        active-text-color="#38bdf8"
        :router="true"
        class="border-none bg-transparent"
      >
        <el-menu-item index="/">
          <template #title>
            <span class="font-medium">Dashboard</span>
          </template>
          <LayoutDashboard class="w-5 h-5 mr-3 flex-shrink-0" />
        </el-menu-item>

        <!-- Submenu: Catálogo -->
        <el-sub-menu index="catalog">
          <template #title>
            <div class="flex items-center">
              <ShoppingBag class="w-5 h-5 mr-3 flex-shrink-0" />
              <span class="font-medium">Catálogo</span>
            </div>
          </template>

          <el-menu-item index="/products">
            <template #title>
              <span class="flex items-center gap-2">
                <Package class="w-4 h-4" />
                Productos
              </span>
            </template>
          </el-menu-item>

          <el-menu-item index="/categories">
            <template #title>
              <span class="flex items-center gap-2">
                <Tags class="w-4 h-4" />
                Categorías
              </span>
            </template>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/inventory">
          <template #title>
            <span class="font-medium">Inventario</span>
          </template>
          <Boxes class="w-5 h-5 mr-3 flex-shrink-0" />
        </el-menu-item>

        <el-menu-item index="/customers">
          <template #title>
            <span class="font-medium">Clientes</span>
          </template>
          <Users class="w-5 h-5 mr-3 flex-shrink-0" />
        </el-menu-item>

        <el-menu-item index="/settings">
          <template #title>
            <span class="font-medium">Configuración</span>
          </template>
          <Settings class="w-5 h-5 mr-3 flex-shrink-0" />
        </el-menu-item>
      </el-menu>
    </div>

    <!-- Footer System Status -->
    <div v-if="!isCollapsed" class="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
      <div class="flex items-center justify-between mb-1">
        <span class="font-medium text-slate-300">Versión Architecture</span>
        <span class="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-sky-400 font-mono">v1.0.0</span>
      </div>
      <p class="text-[11px] text-slate-500">Vue 3 + Element Plus + TanStack</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Box,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Boxes,
  Users,
  Settings,
} from 'lucide-vue-next'

defineProps<{
  isCollapsed: boolean
}>()

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
:deep(.el-menu-item.is-active) {
  background-color: #1e293b !important;
  font-weight: 600;
  border-left: 3px solid #38bdf8;
}
:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: #1e293b !important;
  color: #f8fafc !important;
}
</style>
