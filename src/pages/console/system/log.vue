<template>
  <VCard>
    <VToolbar title="日志管理"> </VToolbar>
    <v-data-table-server v-model:options="options" :headers="headers" :items="serverItems" :items-length="totalItems"
      :loading="loading" item-value="name" :mobile="$vuetify.display.smAndDown" @update:options="loadItems">
    </v-data-table-server>
  </VCard>
</template>

<script setup>
import { OperationLogApi } from '@/api/operation-log';
import { ref } from 'vue';

const options = ref({
  page: 1,
  itemsPerPage: 5
})
const headers = ref([
  { title: '用户名', align: 'start', sortable: false, key: 'uname', nowrap: true },
  { title: '模块', key: 'module', nowrap: true },
  { title: '操作', key: 'message', nowrap: true },
  { title: '类型', key: 'type', nowrap: true },
  { title: '请求参数', key: 'reqParam', nowrap: true },
  // { title: '响应参数', key: 'resParam', nowrap: true },
  // { title: '请求用时', key: 'takeUpTime', nowrap: true },
  { title: 'URI', key: 'uri', nowrap: true },
  { title: 'IP', key: 'ip', nowrap: true },
  { title: '时间', key: 'createTime', nowrap: true },
])
const serverItems = ref([])
const totalItems = ref(0)
const loading = ref(true)

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const res = await OperationLogApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
  })
  serverItems.value = res.records
  totalItems.value = res.total
  loading.value = false
}

</script>


<style scoped></style>
