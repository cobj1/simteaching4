<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-notifications></v-notifications>
  </v-app>
</template>

<script lang="ts" setup>
import { useSettingsStore } from './stores/settings';

const useSystemThemes = useSettingsStore();
useSystemThemes.initTheme()
</script>
