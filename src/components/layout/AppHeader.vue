<template>
  <header class="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
    <!-- Left Section: Toggle & Breadcrumbs -->
    <div class="flex items-center gap-3 md:gap-4">
      <button
        type="button"
        class="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 transition-all focus:outline-none"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle Sidebar"
      >
        <Menu v-if="isSidebarCollapsed" class="w-5 h-5" />
        <PanelLeftClose v-else class="w-5 h-5" />
      </button>

      <el-breadcrumb separator="/" class="hidden sm:block">
        <el-breadcrumb-item :to="{ path: '/' }">
          <span class="flex items-center gap-1.5 text-slate-600 font-medium hover:text-blue-600 transition-colors">
            <Home class="w-4 h-4" />
            Inicio
          </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
          <span class="font-semibold text-slate-800">{{ item.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Right Section: Status Pill, Notifications, Profile -->
    <div class="flex items-center gap-3">
      <!-- Quick Status Pill -->
      <div class="hidden lg:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-sky-50 text-blue-800 text-xs font-semibold rounded-full border border-blue-200/60 shadow-2xs">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span class="w-2 h-2 rounded-full bg-emerald-500 absolute"></span>
        <span>Entorno Demo: DummyJSON API</span>
      </div>

      <!-- Notifications Bell -->
      <el-tooltip content="Notificaciones del sistema" placement="bottom">
        <div class="cursor-pointer p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-full transition-all relative">
          <el-badge :value="3" class="item">
            <Bell class="w-5 h-5" />
          </el-badge>
        </div>
      </el-tooltip>

      <!-- User Profile Dropdown -->
      <el-dropdown trigger="click">
        <div class="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors">
          <el-avatar
            :size="36"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
            class="ring-2 ring-blue-500/20"
          >
            AD
          </el-avatar>
          <div class="hidden sm:flex flex-col text-left">
            <span class="text-xs font-bold text-slate-800 leading-tight">Admin Master</span>
            <span class="text-[10px] font-semibold text-blue-600">Senior Engineer</span>
          </div>
          <ChevronDown class="w-4 h-4 text-slate-400" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="!rounded-xl !p-1.5">
            <el-dropdown-item class="!rounded-lg">
              <div class="flex items-center gap-2 text-xs font-medium text-slate-700">
                <User class="w-4 h-4 text-blue-600" /> Mi Perfil
              </div>
            </el-dropdown-item>
            <el-dropdown-item class="!rounded-lg">
              <div class="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Settings class="w-4 h-4 text-purple-600" /> Configuración
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided class="!rounded-lg">
              <div class="flex items-center gap-2 text-xs font-bold text-red-600">
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
