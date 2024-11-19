<template>
  <v-card>
    <v-toolbar title="权限列表"></v-toolbar>
    <v-list :items="items"></v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  {
    title: '作业管理',
    value: '07e7796777383ddf0b86fdd6ef23207f',
    key: 'homework'
  },
  {
    title: '用户管理',
    value: '2cb84dc55aeab35e262474b2cba031d8',
    key: 'user'
  },
  {
    title: '组织管理',
    value: '05f5277b2e108f20c017b07651042ee1',
    key: 'org'
  },
])
</script>

<style scoped></style>
