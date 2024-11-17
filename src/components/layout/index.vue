<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" nav>
        <v-list-subheader>Navigation</v-list-subheader>
        <div v-for="(item, i) in items" :key="item.title">
          <v-list-item :value="item" color="primary" v-if="item.children == null || item.children.length == 0">
            <template v-slot:prepend> <v-icon :icon="item.prependIcon"></v-icon> </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-group :value="item.title" v-else>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" color="primary">
                <template v-slot:prepend> <v-icon :icon="item.prependIcon"></v-icon> </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-for="(child) in item.children" :key="child.title" :value="child" color="primary">
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
      <template #append>
        <v-list-item class="ma-2" link nav prepend-icon="mdi-cog-outline" title="Settings" />
      </template>
    </v-navigation-drawer>

    <v-app-bar border="b" class="ps-4" flat>
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

      <v-app-bar-title>智慧教育云仿真管理平台</v-app-bar-title>

      <template #append>
        <v-switch class="pr-4" v-model="isDark" :label="isDark ? '暗色主题' : '浅色主题'" hide-details></v-switch>
        <v-btn v-if="accountStore.token" class="text-none me-2" height="48" icon slim>
          <v-avatar color="surface-light" size="32">
            {{ accountStore.info.name }}
          </v-avatar>
          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item append-icon="mdi-cog-outline" link title="Settings" />

              <v-list-item append-icon="mdi-logout" link title="Logout" />
            </v-list>
          </v-menu>
        </v-btn>
        <v-btn v-else class="text-none me-2" @click="router.push('/login')" >
          <span style="font-size: 13px;">未登录</span>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <div class="pa-4">
        <!-- <v-sheet border="dashed md" color="surface-light" height="500" rounded="lg" width="100%" /> -->
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { useAccountStore } from '@/stores/account';
import { useDark } from '@vueuse/core';
import { watch } from 'vue';
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

const router = useRouter()
const accountStore = useAccountStore()
const drawer = ref(true)
const theme = useTheme()
const isDark = ref(theme.global.name.value == 'dark')

watch(isDark, (value) => {
  theme.global.name.value = value ? 'dark' : 'light'
})

const items = ref([
  {
    title: '后台首页',
    prependIcon: 'mdi-view-dashboard-outline',
    link: true,
  },
  {
    title: '组织管理',
    prependIcon: 'mdi-account-group',
    link: true,
    children: [
      {
        title: '组织中心',
      },
      {
        title: '学校',
      }
    ]
  },
  {
    title: '用户管理',
    prependIcon: 'mdi-account-group',
    link: true,
    children: [
      {
        title: '角色列表',
      },
      {
        title: '权限列表',
      },
      {
        title: '校级管理员',
      },
    ]
  },
  {
    title: '系统管理',
    prependIcon: 'mdi-briefcase-outline',
    link: true,
    children: [
      {
        title: '数据监控'
      },
      {
        title: '字典管理'
      },
      {
        title: '参数设置'
      },
      {
        title: '日志管理'
      }
    ]
  },
  {
    title: '试用管理',
    prependIcon: 'mdi-briefcase-outline',
    link: true,
    children: [
      {
        title: '审核申请'
      },
      {
        title: '试用账号'
      }
    ]
  },
  {
    title: '资源管理',
    prependIcon: 'mdi-briefcase-outline',
    link: true,
  },
  {
    title: '共享资源库',
    prependIcon: 'mdi-calendar',
    link: true,
  },
  {
    title: '考勤管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '课程管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '作业管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '考试管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '数据中心',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '新闻',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '通知公告',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '门户管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
])
</script>
<style>
.v-layout {
  height: 100%;
}
</style>
