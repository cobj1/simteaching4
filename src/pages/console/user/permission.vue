<template>
  <v-card>
    <v-toolbar title="权限列表"></v-toolbar>
    <v-list>
      <v-list-item v-for="item in items" :key="item.value" :title="item.title">
        <v-list-item-subtitle class="py-2">
          <strong>Key: </strong> {{ item.key }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { PermissionApi } from '@/api/user/permission';
import { onMounted, ref } from 'vue';

const items = ref([{
  title: '',
  value: '',
  subtitle: ''
}])

onMounted(async () => {
  const res = await PermissionApi.selectAll()
  items.value = res.map((item) => {
    return { title: item.name, key: item.key, value: item.id }
  })
})
</script>

<style scoped></style>
