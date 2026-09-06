<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200/80">
    <div class="flex items-center gap-3">
      <div v-if="$slots.icon" class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
        <slot name="icon" />
      </div>
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
          {{ description }}
        </p>
      </div>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-3 flex-wrap">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
