<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher class="position-fixed">
      <v-list nav>
        <v-list-subheader>
          <div class="d-flex align-center ga-1">
            <v-icon icon="mdi-console"></v-icon>
            控制台 {{ vuetify.display.smAndUp }}
          </div>
        </v-list-subheader>
        <div v-for="(item) in consoleStore.items" :key="item.title">
          <v-divider v-if="item.type == 'divider'"></v-divider>
          <div v-if="item.type == 'subheader'">
            <v-divider></v-divider>
            <v-list-subheader>
              <div class="d-flex align-center ga-1">
                <v-icon :icon="item.prependIcon"></v-icon>
                {{ item.title }}
              </div>
            </v-list-subheader>
          </div>
          <v-list-item v-else-if="item.children == null || item.children.length == 0" :value="item" color="primary"
            :to="item.path">
            <template v-slot:prepend>
              <v-icon :icon="item.prependIcon" v-if="item.prependIcon"></v-icon>
              <v-avatar v-if="item.avatar" color="blue-darken-3" size="32" :icon="item.avatar" class="mr-2 ">
                {{ item.avatar }}
              </v-avatar>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-group v-else :value="item.title">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" color="primary">
                <template v-slot:prepend> <v-icon :icon="item.prependIcon"></v-icon> </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-for="(child) in item.children" :key="child.title" :value="child" color="primary"
              :to="child.path">
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
      <template #append>
        <SystemSettings> </SystemSettings>
      </template>
    </v-navigation-drawer>

    <v-app-bar border="b" class="ps-4 position-fixed" flat>
      <v-app-bar-nav-icon v-if="$vuetify.display.mdAndDown" @click="drawer = !drawer" />
      <v-app-bar-title>智慧教育云仿真管理平台</v-app-bar-title>
      <template #append>
        <v-btn icon class="mr-4">
          <v-icon icon="mdi-plus"></v-icon>
          <CourseRegister></CourseRegister>
        </v-btn>
        <ThemeSwitch></ThemeSwitch>
        <UserPanel></UserPanel>
      </template>
    </v-app-bar>
    <v-main>
      <div class="pa-4">
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import vuetify from '@/plugins/vuetify';
import { useAccountStore } from '@/stores/account';
import { useConsoleStore } from '@/stores/console';
import { onMounted, ref, watch } from 'vue'

const consoleStore = useConsoleStore()
const account = useAccountStore()
const drawer = ref(!vuetify.display.mdAndDown.value)

watch(() => vuetify.display.mdAndDown.value, (value) => drawer.value = !value)

onMounted(async () => {
  if (account.token) {
    consoleStore.loadUserManage()
    consoleStore.loadCourse()
  }
})
</script>
<style scoped>
.v-layout {
  height: 100%;
}
</style>
