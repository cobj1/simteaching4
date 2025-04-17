<template>
  <VCard>
    <VToolbar title="考勤管理">
    </VToolbar>
    <v-data-table-server v-model:options="options" :items-per-page="options.itemsPerPage" :headers="headers"
      :items="serverItems" :items-length="totalItems" :loading="loading"
      :search="`${search.org},${search.name},${search.date}`" item-value="name" :mobile="$vuetify.display.smAndDown"
      @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex flex-wrap">
          <v-btn prepend-icon="mdi-bank" class="ma-2 flex-1-1" size="large" min-height="56">
            <div v-if="search.orgItem">{{ searchOrgItemNames.at(-1) }} </div>
            <div v-else> 筛选组织</div>
            <SelectionOrg @confirm="handleSearchSelectionOrgConfirm"></SelectionOrg>
            <v-tooltip v-if="search.orgItem" activator="parent" location="top">
              {{ searchOrgItemNames.join(' / ') }}
            </v-tooltip>
          </v-btn>
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..." min-width="150px"
            append-inner-icon="mdi-magnify" clearable></v-text-field>
          <v-date-input hide-details v-model="search.date" label="选择范围" multiple="range"
            class="ma-2 flex-1-1"></v-date-input>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.uname="{ item }">
        <a class="app-link text-decoration-none text-primary font-weight-medium d-inline-flex align-center cursor-pointer"
          @click="openLog(item)">
          {{ item.uname }}
        </a>
      </template>
    </v-data-table-server>

  </VCard>
  <v-navigation-drawer v-model="drawerLog" temporary location="right" :width="500">
    <v-data-iterator :items="logs" :page="logsPage" :items-per-page="10">
      <template v-slot:default="{ items }">
        <template v-for="(item, i) in items" :key="i">
          <v-card v-bind="item.raw" class="my-2"></v-card>
        </template>
      </template>
      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn :disabled="page === 1" density="comfortable" icon="mdi-arrow-left" variant="tonal" rounded
            @click="prevPage"></v-btn>

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn :disabled="page >= pageCount" density="comfortable" icon="mdi-arrow-right" variant="tonal" rounded
            @click="nextPage"></v-btn>
        </div>
      </template>
    </v-data-iterator>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block @click="closeLog">
          关闭
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'
import { AttendanceApi } from '@/api/user/attendance';
import { OrgApi } from '@/api/user/org';
import { useDateFormat } from '@vueuse/core';
import { computed, nextTick, ref } from 'vue';

const drawerLog = ref(false)
const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([
  { title: '姓名', key: 'uname', sortable: false, },
  { title: '班级', key: 'orgName', sortable: false, },
  { title: '岗位', key: 'post', sortable: false, },
  { title: '登录时间', key: 'loginTime' },
])
const search = ref({
  name: '',
  org: null,
  orgItem: null,
  date: []
})
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const searchOrgItemNames = computed(() => {
  if (search.value.orgItem) {
    return orgNames(search.value.orgItem).reverse()
  }
  return null;
})
const orgNames = (org) => {
  if (org.parent) return [org.name, ...orgNames(org.parent)]
  else return [org.name]
}
const logsPage = ref(1)
const logs = ref([])

const handleSearchSelectionOrgConfirm = async (value) => {
  search.value.org = value.join(',')
  search.value.orgItem = await OrgApi.selectOneAndParentById(search.value.org)
}

const openLog = async (item) => {
  const res = await AttendanceApi.own({
    uid: item.uid,
    current: 1,
    size: 50
  })
  logs.value = res.records.map(item => {
    return {
      title: useDateFormat(item.login_time, 'YYYY-MM-DD HH:mm:ss').value,
      subtitle: item.success == 1 ? '登录成功' : '登录失败'
    }
  })
  drawerLog.value = true
}
const closeLog = () => {
  drawerLog.value = false
  nextTick(() => {
    logs.value = []
    logsPage.value = 1
  })
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  console.log(sortBy[0])
  console.log(sortBy[0].key)
  const res = await AttendanceApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    name: search.value.name,
    org: search.value.org,
    starDste: search.value.date.length > 0 ? useDateFormat(search.value.date[0], 'YYYY-MM-DD').value : null,
    endDate: search.value.date.length > 0 ? useDateFormat(search.value.date.at(-1), 'YYYY-MM-DD').value : null,
  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
      loginTime: useDateFormat(item.login_time, 'YYYY-MM-DD HH:mm')
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
