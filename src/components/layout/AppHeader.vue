<template>
  <header class="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
    <!-- Left Section: Toggle & Breadcrumbs -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle Sidebar"
      >
        <Menu v-if="isSidebarCollapsed" class="w-5 h-5" />
        <PanelLeftClose v-else class="w-5 h-5" />
      </button>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <span class="flex items-center gap-1 text-gray-600 font-medium hover:text-brand-600">
            <Home class="w-4 h-4" />
            Inicio
          </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          <span class="font-medium text-gray-800">{{ item.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Right Section: Actions, Notifications, Profile -->
    <div class="flex items-center gap-3">
      <!-- Quick Info / Status -->
      <div class="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-brand-700 text-xs font-semibold rounded-full border border-blue-200">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Entorno Demo: DummyJSON</span>
      </div>

      <!-- Notifications -->
      <el-tooltip content="Notificaciones del sistema" placement="bottom">
        <div class="cursor-pointer p-2 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <el-badge :value="3" class="item">
            <Bell class="w-5 h-5" />
          </el-badge>
        </div>
      </el-tooltip>

      <!-- User Profile Dropdown -->
      <el-dropdown trigger="click">
        <div class="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <el-avatar
            :size="34"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
          >
            AD
          </el-avatar>
          <div class="hidden sm:flex flex-col text-left">
            <span class="text-xs font-semibold text-gray-800 leading-tight">Admin Master</span>
            <span class="text-[10px] text-gray-500">Senior Engineer</span>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-400" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div class="flex items-center gap-2 text-gray-700">
                <User class="w-4 h-4" /> Mi Perfil
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="flex items-center gap-2 text-gray-700">
                <Settings class="w-4 h-4" /> Configuración
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="flex items-center gap-2 text-red-600 font-medium">
                <LogOut class="w-4 h-4" /> Cerrar Sesión
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu,
  PanelLeftClose,
  Home,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-vue-next'

defineProps<{
  isSidebarCollapsed: boolean
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((m) => m.meta && m.meta.title)
  return matched.map((m) => ({
    name: (m.meta.title as string) || m.name,
    path: m.path,
  }))
})
</script>
