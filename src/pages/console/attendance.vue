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
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..."
            append-inner-icon="mdi-magnify"></v-text-field>
          <v-date-input hide-details v-model="search.date" label="选择范围" max-width="368" multiple="range"
            class="ma-2 flex-1-1"></v-date-input>
        </div>
      </template>
    </v-data-table-server>
  </VCard>
</template>

<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'
import { AttendanceApi } from '@/api/user/attendance';
import { OrgApi } from '@/api/user/org';
import { useDateFormat } from '@vueuse/core';
import { computed, ref } from 'vue';

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

const handleSearchSelectionOrgConfirm = async (value) => {
  search.value.org = value.join(',')
  search.value.orgItem = await OrgApi.selectOneAndParentById(search.value.org)
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
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
