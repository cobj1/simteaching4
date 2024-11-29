<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="600"
    :fullscreen="$vuetify.display.smAndDown">
    <template v-slot:activator="{ props: activatorProps }">
      <v-list-item class="ma-2" link nav prepend-icon="mdi-cog-outline" title="系统设置" v-bind="activatorProps" />
    </template>
    <v-card>
      <v-toolbar>
        <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        <v-toolbar-title>系统设置</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-list lines="two" subheader>
        <v-list-subheader>默认主题</v-list-subheader>

        <v-list-item>
          <v-radio-group v-model="settingsStore.useSystemThemes" inline>
            <v-radio label="基于系统首选项主题" :value="true" @change="settingsStore.initTheme()"></v-radio>
            <v-radio label="手动设置" :value="false"> </v-radio>
          </v-radio-group>
        </v-list-item>

        <v-list-subheader>切换主题</v-list-subheader>
        <v-list-item>
          <ThemeSwitch class="pl-2" :disabled="settingsStore.useSystemThemes"></ThemeSwitch>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';
import { ref } from 'vue';

const dialog = ref(false)
const settingsStore = useSettingsStore()
</script>

<style lang="scss" scoped></style>
