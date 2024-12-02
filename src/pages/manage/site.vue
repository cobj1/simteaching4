<template>
  <VCard>
    <VToolbar title="门户管理">
      <SiteType>
        <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
      </SiteType>
      <v-btn color="primary" @click="addItem()">
        新增项目
      </v-btn>
    </VToolbar>
    <v-data-table-server v-model:options="options" :headers="headers" :items="serverItems" :items-length="totalItems"
      :loading="loading" :search="`${search.type},${search.title}`" item-value="name" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-select v-model="search.type" class="pa-2" label="筛选类型..." :items="types" item-title="type"
            item-value="id"></v-select>
          <v-text-field v-model="search.title" class="pa-2" label="检索..."></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn icon="mdi-pencil" variant="text" density="comfortable" size="small" @click="editItem(item)"></VBtn>
        <VBtn icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="800px">
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
                <v-text-field v-model="editedItem.author" label="作者"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="editedItem.typeId" label="类型" :items="types" item-title="type"
                  item-value="id"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.cover" label="封面(url)"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-card title="内容">
                  <ckeditor v-model="editedItem.content" :editor="editor" :config="editorConfig" />
                </v-card>
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
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import SiteType from '@/components/SiteType.vue';
import { SiteApi } from '@/api/site';
import { computed, nextTick, ref, reactive } from 'vue';
import { FileApi } from '@/api/file';

const editor = ref(ClassicEditor)
const editorConfig = reactive({
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
})
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
  { title: '类型', key: 'typeName', },
  { title: '作者', key: 'author' },
  { title: '发布时间', key: 'createTime', },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref({
  title: '',
  type: null
})
const serverItems = ref([])
const types = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  title: '',
  author: '',
  typeId: null,
  cover: '',
  content: '',
  contentOld: ''
})
const defaultItem = ref({
  id: null,
  title: '',
  author: '',
  typeId: null,
  cover: '',
  content: '',
  contentOld: ''
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
  if (editedItem.value.content) {
    try {
      const res = await FileApi.downloadTxt(editedItem.value.content)
      editedItem.value.contentOld = editedItem.value.content
      editedItem.value.content = res
    } catch (e) { /* empty */ }
  }
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
  await SiteApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}

const save = async () => {
  const blob = new Blob([editedItem.value.content])
  const file = new File([blob], editedItem.value.title + '.txt', { type: 'text/plain' })
  const res = await FileApi.upload(file, 'simteaching/site/content')
  editedItem.value.content = res.url
  if (editedItem.value.contentOld) FileApi.delete(editedItem.value.contentOld)
  await SiteApi.save(editedItem.value)
  close()
  loadItems(options.value)
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  types.value = await SiteApi.typeSelectAll()
  const res = await SiteApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    typeId: search.value.type,
    title: search.value.title
  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
      typeName: types.value.find(type => type.id == item.typeId)?.type
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
