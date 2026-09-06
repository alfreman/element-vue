<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="!isCollapsed"
      class="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 transition-opacity"
      @click="$emit('close-mobile')"
    />

    <!-- Sidebar Container -->
    <aside
      class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white transition-all duration-300 flex flex-col h-screen fixed md:sticky top-0 z-40 border-r border-slate-800/80 select-none shadow-xl"
      :class="[
        isCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-64',
      ]"
    >
      <!-- Brand Logo Section -->
      <div class="h-16 flex items-center px-4 border-b border-slate-800/80 overflow-hidden bg-slate-950/80">
        <router-link to="/" class="flex items-center gap-3 w-full">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25 flex-shrink-0">
            <Box class="w-5 h-5" />
          </div>
          <div v-if="!isCollapsed" class="flex flex-col overflow-hidden">
            <span class="font-extrabold text-base tracking-wider text-slate-100 truncate">VUE ERP</span>
            <span class="text-[10px] text-sky-400 font-bold tracking-widest uppercase">Products Module</span>
          </div>
        </router-link>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-y-auto py-3 custom-sidebar-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          background-color="transparent"
          text-color="#94a3b8"
          active-text-color="#38bdf8"
          :router="true"
          class="border-none bg-transparent"
        >
          <el-menu-item index="/">
            <template #title>
              <span class="font-medium">Dashboard</span>
            </template>
            <LayoutDashboard class="w-5 h-5 mr-3 flex-shrink-0 text-slate-400" />
          </el-menu-item>

          <!-- Submenu: Catálogo -->
          <el-sub-menu index="catalog">
            <template #title>
              <div class="flex items-center">
                <ShoppingBag class="w-5 h-5 mr-3 flex-shrink-0 text-slate-400" />
                <span class="font-medium">Catálogo</span>
              </div>
            </template>

            <el-menu-item index="/products">
              <template #title>
                <span class="flex items-center gap-2 font-medium">
                  <Package class="w-4 h-4" />
                  Productos
                </span>
              </template>
            </el-menu-item>

            <el-menu-item index="/categories">
              <template #title>
                <span class="flex items-center gap-2 font-medium">
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
            <Boxes class="w-5 h-5 mr-3 flex-shrink-0 text-slate-400" />
          </el-menu-item>

          <el-menu-item index="/customers">
            <template #title>
              <span class="font-medium">Clientes</span>
            </template>
            <Users class="w-5 h-5 mr-3 flex-shrink-0 text-slate-400" />
          </el-menu-item>

          <el-menu-item index="/settings">
            <template #title>
              <span class="font-medium">Configuración</span>
            </template>
            <Settings class="w-5 h-5 mr-3 flex-shrink-0 text-slate-400" />
          </el-menu-item>
        </el-menu>
      </div>

      <!-- Footer System Status -->
      <div v-if="!isCollapsed" class="p-4 border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-400">
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold text-slate-300">Stack ERP</span>
          <span class="px-2 py-0.5 rounded-full bg-blue-950 text-[10px] text-sky-400 font-mono font-bold border border-sky-500/30">v1.0.0</span>
        </div>
        <p class="text-[11px] text-slate-500">Vue 3 + Element Plus + TanStack</p>
      </div>
    </aside>
  </div>
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

defineEmits<{
  (e: 'close-mobile'): void
}>()

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
:deep(.el-menu-item.is-active) {
  background-color: #1e293b !important;
  font-weight: 700;
  color: #38bdf8 !important;
  border-left: 4px solid #38bdf8;
}
:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: #1e293b/80 !important;
  color: #f8fafc !important;
}
</style>
