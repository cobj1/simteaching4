<template>
  <v-switch class="pr-4" v-model="settingsStore.isDark" :label="settingsStore.isDark ? '暗色主题' : '浅色主题'" hide-details
    @change="settingsStore.useSystemThemes = false"></v-switch>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore()
</script>

<style scoped></style>
