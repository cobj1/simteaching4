<template>
  <VCard>
    <VToolbar title="通知公告">
      <v-btn color="primary" dark @click="addItem()">
        新增项目
      </v-btn>
    </VToolbar>
    <v-data-table-server v-model:options="options" :headers="headers" :items="serverItems" :items-length="totalItems"
      :loading="loading" :search="search" item-value="name" @update:options="loadItems">
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn icon="mdi-pencil" variant="text" density="comfortable" size="small" @click="editItem(item)"></VBtn>
        <VBtn icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.title" label="标题"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.type" label="类型" :items="NoticeApi.noticeType"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.cover" label="封面(url)"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.content" label="内容"></v-text-field>
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
import { NoticeApi } from '@/api/notice'
import { computed, nextTick, ref } from 'vue';

const options = ref({
  page: 1,
  itemsPerPage: 5
})
const headers = ref([
  {
    title: '标题',
    align: 'start',
    sortable: false,
    key: 'title',
  },
  { title: '类型', key: 'type', },
  { title: '发布时间', key: 'createTime', },
  { title: '发布人', key: 'authorName', },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref('')
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  title: '',
  type: null,
  cover: '',
  content: '',
})
const defaultItem = ref({
  id: null,
  title: '',
  type: null,
  cover: '',
  content: '',
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增项目' : '编辑项目')

const addItem = () => {
  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1;
  dialog.value = true
}

const editItem = (item) => {
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
  await NoticeApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}


const save = async () => {
  await NoticeApi.save(editedItem.value)
  loadItems(options.value)
  close()
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const res = await NoticeApi.page({
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
