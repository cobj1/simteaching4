<template>
  <v-card>
    <v-toolbar title="权限列表"></v-toolbar>
    <v-list>
      <v-list-item v-for="item in items" :key="item.value" :title="item.title" :subtitle="item.key">
      </v-list-item>
      <v-list-item-subtitle></v-list-item-subtitle>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { PermissionApi } from '@/api/permission';
import { onMounted, ref } from 'vue';

const items = ref([{
  title: '',
  value: '',
  subtitle: ''
}])

onMounted(async () => {
  const res = await PermissionApi.selectAll() as any
  items.value = res.map((item: { name: any; id: any; key: any; }) => {
    return { title: item.name, key: item.key, value: item.id }
  })
})
</script>

<style scoped></style>
