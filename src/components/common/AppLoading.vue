<template>
  <div class="p-6 bg-white rounded-lg shadow-sm">
    <el-skeleton :rows="rows" animated />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number
  }>(),
  {
    rows: 6,
  }
)
</script>
