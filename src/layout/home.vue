<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer v-model="drawer" color="primary" disable-resize-watcher>
      <v-list nav>
        <v-list-item v-for="(item, i) in items" :key="i" :active="i === 0" link :title="item.text" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="px-md-4 position-fixed">
      <v-container class="mx-auto d-flex align-center justify-center" max-width="1600px">
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />
        <v-img class="me-sm-8" max-width="40" src="/favicon.ico" />
        <div v-if="$vuetify.display.mdAndUp">
          <v-btn class="me-2 text-none" v-for="(item, i) in items" :key="i" :active="item.path == route.fullPath"
            variant="text" slim v-bind="item" @click="router.push(item.path)"></v-btn>
        </div>
        <v-spacer></v-spacer>
        <ThemeSwitch></ThemeSwitch>
        <UserPanel></UserPanel>
      </v-container>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center">
      <slot></slot>
    </v-main>

    <v-footer name="footer" app>
      <v-btn class="mx-auto" variant="text">
        Copyright@北京大学数学科学学院
      </v-btn>
    </v-footer>
  </v-layout>
</template>

<script setup>
import UserPanel from '@/components/UserPanel.vue';
import { shallowRef } from 'vue'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const drawer = shallowRef(false)


const items = [
  {
    text: '首页',
    path: '/home'
  },
  {
    text: '学术报告',
    path: '/home/articles'
  },
  {
    text: '学校概况',
    path: '/home/about'
  },
  {
    text: '学校新闻',
    path: '/home/news'
  }
]


</script>
