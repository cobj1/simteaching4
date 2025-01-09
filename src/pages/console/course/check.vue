<template>
  <VCard>
    <VToolbar title="课程审核">
    </VToolbar>
    <v-data-table-server v-model:options="options" :items-per-page="options.itemsPerPage" :headers="headers"
      :items="serverItems" :items-length="totalItems" :loading="loading"
      :search="`${search.category},${search.type},${search.name}`" item-value="name"
      :mobile="$vuetify.display.smAndDown" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-select hide-details v-model="search.category" class="pa-2" label="筛选类型..." :items="resourceStore.categorys"
            item-title="name" item-value="id" clearable></v-select>
          <v-select hide-details v-model="search.type" class="pa-2" label="课程种类..." :items="types" item-title="label"
            item-value="value" clearable></v-select>
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..." append-inner-icon="mdi-magnify"
            clearable></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.cover="{ item }">
        <div class="pa-2">
          <v-img :src="item.cover" :width="80" :height="45" cover>
            <template v-slot:placeholder>
              <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
            </template>
            <template v-slot:error>
              <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
            </template>
          </v-img>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.startTime="{ item }">
        {{ item.startTime }} - {{ item.stopTime }}

      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn prepend-icon="mdi-clipboard-check-outline" variant="text" text="审核"></VBtn>
      </template>
    </v-data-table-server>
  </VCard>

</template>

<script setup>
import { ref } from 'vue';
import { CourseApi } from '@/api/course/course';
import { useClipboard } from '@vueuse/core';
import { useResourceStore } from '@/stores/resource';

const resourceStore = useResourceStore()
const { copy } = useClipboard()
const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([
  { title: '封面', key: 'cover', sortable: false, },
  { title: '标题', key: 'name', },
  { title: '主题', key: 'subject', },
  { title: '教室', key: 'classroom', },
  { title: '类型', key: 'categoryName', sortable: false },
  { title: '种类', key: 'typeName', sortable: false },
  { title: '开放时间', key: 'startTime' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref({
  name: '',
  category: null,
  type: null
})
const serverItems = ref([])
const types = ref([{ label: '普通课程', value: 'general' }, { label: '仿真课程', value: 'simulation' }])
const loading = ref(true)
const totalItems = ref(0)

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  await resourceStore.loadCategorys()
  const res = await CourseApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    category: search.value.category,
    name: search.value.name,
    type: search.value.type
  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
      categoryName: item.category ? resourceStore.categorys.find(category => category.id == item.category)?.name : "<未分类>",
      typeName: item.type ? types.value.find(type => type.value == item.type)?.label : "",
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
