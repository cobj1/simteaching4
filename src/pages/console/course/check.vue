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
          <v-img :src="useFileUri(item.cover)" :width="80" :height="45" cover>
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
        <VBtn prepend-icon="mdi-clipboard-check-outline" variant="text" text="审核" @click="checkItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialogCheck" max-width="500">
      <v-card rounded="lg" title="审核课程">
        <template #prepend>
          <v-avatar color="warning" icon="mdi-alert-outline" variant="tonal" />
        </template>
        <template #text>
          <div class="mb-4 text-body-2 text-medium-emphasis">
            课程审核可以规范教师的教学行为，促使教师认真备课、精心设计教学环节，按照教学大纲的要求进行教学。这有助于提高教师的教学水平，促进教师的专业发展。
          </div>
          <v-radio-group v-model="editedItem.status" inline>
            <v-radio label="审核通过" :value="1"></v-radio>
            <v-radio label="审核不通过" :value="2"></v-radio>
          </v-radio-group>
        </template>
        <v-divider />
        <template #actions>
          <v-spacer />
          <v-btn border class="text-none" color="surface" text="取消" variant="flat" @click="closeCheck" />
          <v-btn class="text-none" color="warning" text="确定" variant="flat" @click="confirmCheck" />
        </template>
      </v-card>
    </v-dialog>
  </VCard>
</template>

<script setup>
  import {
    nextTick,
    ref
  } from 'vue';
  import {
    CourseApi
  } from '@/api/course/course';
  import {
    useResourceStore
  } from '@/stores/resource';
  import {
    useFileUri
  } from '@/utils/simulation-uri';

  const resourceStore = useResourceStore()
  const dialogCheck = ref(false)
  const options = ref({
    page: 1,
    itemsPerPage: 10
  })
  const headers = ref([{
      title: '封面',
      key: 'cover',
      sortable: false,
    },
    {
      title: '标题',
      key: 'name',
    },
    {
      title: '主题',
      key: 'subject',
    },
    {
      title: '教室',
      key: 'classroom',
    },
    {
      title: '类型',
      key: 'categoryName',
      sortable: false
    },
    {
      title: '种类',
      key: 'typeName',
      sortable: false
    },
    {
      title: '开放时间',
      key: 'startTime'
    },
    {
      title: 'Actions',
      key: 'actions',
      sortable: false,
      align: 'end'
    },
  ])
  const search = ref({
    name: '',
    category: null,
    type: null
  })
  const serverItems = ref([])
  const types = ref([{
    label: '普通课程',
    value: 'general'
  }, {
    label: '仿真课程',
    value: 'simulation'
  }])
  const loading = ref(true)
  const totalItems = ref(0)
  const editedItem = ref({
    id: null
  })
  const defaultItem = ref({
    id: null
  })

  const checkItem = (item) => {
    editedItem.value = Object.assign({}, item)
    editedItem.value.status = 1
    dialogCheck.value = true;
  }

  const closeCheck = () => {
    dialogCheck.value = false;
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem.value)
    })
  }

  const confirmCheck = async () => {
    await CourseApi.checked(editedItem.value.id, editedItem.value.status)
    loadItems(options.value)
    closeCheck()
  }

  const loadItems = async ({
    page,
    itemsPerPage,
    sortBy
  }) => {
    loading.value = true
    await resourceStore.loadCategorys()
    const res = await CourseApi.checkPage({
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
        categoryName: item.category ? resourceStore.categorys.find(category => category.id == item.category)
          ?.name : "<未分类>",
        typeName: item.type ? types.value.find(type => type.value == item.type)?.label : "",
      }
    })
    totalItems.value = res.total
    loading.value = false
  }
</script>

<style scoped></style>
