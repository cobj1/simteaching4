<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-notifications></v-notifications>
    <FileList></FileList>
  </v-app>
</template>

<script lang="ts" setup>
import 'ckeditor5/ckeditor5.css';
import { useSettingsStore } from './stores/settings';
import FileList from './components/FileList.vue';

const useSystemThemes = useSettingsStore();
useSystemThemes.initTheme()
</script>
