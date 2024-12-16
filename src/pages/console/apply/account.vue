<template>
  <VCard>
    <VToolbar title="试用账号">
    </VToolbar>
    <v-data-table-server v-model:options="options" :items-per-page="options.itemsPerPage" :headers="headers"
      :items="serverItems" :items-length="totalItems" :loading="loading"
      :search="`${search.org},${search.name},${search.date}`" item-value="name" :mobile="$vuetify.display.smAndDown"
      @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex flex-wrap">
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..."
            append-inner-icon="mdi-magnify"></v-text-field>
        </div>
      </template>
    </v-data-table-server>
  </VCard>
</template>

<script setup>
import { AttendanceApi } from '@/api/user/attendance';
import { UserApi } from '@/api/user/user';
import { ref } from 'vue';

const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([
  { title: '姓名', key: 'username', sortable: false, },
  { title: '班级', key: 'orgName', sortable: false, },
  { title: '岗位', key: 'post', sortable: false, },
  { title: '登录时间', key: 'loginTime', width: '300px' },
])
const search = ref({
  name: '',
})
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const res = await UserApi.trialPage({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    name: search.value.name,

  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
