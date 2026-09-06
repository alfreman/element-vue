<template>
  <div class="min-h-screen flex bg-gray-50 font-sans text-gray-900">
    <!-- Desktop & Mobile Sidebar -->
    <AppSidebar :is-collapsed="isSidebarCollapsed" />

    <!-- Main Container Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-x-hidden">
      <AppHeader
        :is-sidebar-collapsed="isSidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const isSidebarCollapsed = ref(false)

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
