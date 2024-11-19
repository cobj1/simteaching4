<template>
  <v-card>
    <v-toolbar title="角色列表"></v-toolbar>
    <v-list :items="items"></v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  {
    title: '管理员',
    value: '42bd4b21c77843338bcfae2788e3b9d9'
  },
  {
    title: '校级管理员',
    value: '5b282b9bc9344740a88ea33a06322e97'
  },
  {
    title: '教师',
    value: 'a11e9dfcd4f24e529d2704b4130afa58'
  },
  {
    title: '学生',
    value: '13a7a164ce9e4a7890e04646e50fc5cb'
  },
])
</script>

<style scoped></style>
