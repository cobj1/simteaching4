<template>
  <VCard>
    <VToolbar title="申报审核">
    </VToolbar>
    <v-data-table-server v-model:options="options" :headers="headers" :items="serverItems" :items-length="totalItems"
      :loading="loading" :search="`${search.name}`" item-value="name" :mobile="$vuetify.display.smAndDown"
      @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-text-field v-model="search.name" class="pa-2" label="检索..." clearable></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.cover="{ item }">
        <v-img :src="FileApi.filePath + item.cover"></v-img>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="800px" :fullscreen="$vuetify.display.smAndDown" scrollable>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.name" label="申报名称"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.author" label="作者"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.org" label="组织"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.category" label="专业类型"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.type" label="实验类型"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.cover" label="封面(uri)"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.uri" label="实验链接(uri)"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.intro" label="简介"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">
            取消
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">您确定要删除此项目吗？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">取消</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </VCard>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import { FileApi } from '@/api/file';
import { DeclareApi } from '@/api/declare';

const options = ref({
  page: 1,
  itemsPerPage: 5
})
const headers = ref([
  { title: '仿真封面', align: 'start', sortable: false, key: 'cover', nowrap: true },
  { title: '实验名称', align: 'start', sortable: false, key: 'title', nowrap: true },
  { title: '作者', key: 'author', nowrap: true },
  { title: '组织', key: 'org', nowrap: true },
  { title: '专业类型', key: 'category', nowrap: true },
  { title: '实验类型', key: 'type', nowrap: true },
  { title: '发布时间', key: 'createTime', nowrap: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', nowrap: true },
])
const search = ref({
  name: ''
})
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  cover: '',
  name: '',
  uri: '',
  author: '',
  org: '',
  category: '',
  type: '',
  content: '',
  intro: ''
})
const defaultItem = ref({
  id: null,
  cover: '',
  name: '',
  uri: '',
  author: '',
  org: '',
  category: '',
  type: '',
  content: '',
  intro: ''
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增项目' : '编辑项目')

const addItem = () => {
  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1;
  dialog.value = true
}

const editItem = async (item) => {
  editedIndex.value = serverItems.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialog.value = true
}

const deleteItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true;
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
  })
}

const closeDelete = () => {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  })
}

const deleteItemConfirm = async () => {
  await DeclareApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}

const save = async () => {
  await DeclareApi.save(editedItem.value)
  close()
  loadItems(options.value)
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const res = await DeclareApi.self({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    name: search.value.name
  })
  serverItems.value = res.records
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
