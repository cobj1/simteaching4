<template>
  <VCard :elevation="enableSelection ? 0 : 1">
    <VToolbar title="报告模板管理" v-if="!enableSelection">
      <ResourceCategory>
        <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
      </ResourceCategory>
      <v-btn color="primary" dark @click="editItem()">
        新增项目
      </v-btn>
    </VToolbar>
    <v-data-iterator :items="items" :items-per-page="12" :search="search.name">
      <template v-slot:header>
        <div class="d-flex">
          <v-select v-model="search.category" hide-details class="pa-2" label="筛选类型..." :items="resourceStore.categorys"
            item-title="name" item-value="id" clearable></v-select>
          <v-text-field v-model="search.name" hide-details class="pa-2" label="检索..." append-inner-icon="mdi-magnify"
            clearable></v-text-field>
        </div>
      </template>

      <template v-slot:default="{ items }">
        <v-container class="pa-2" fluid>
          <v-row dense>
            <v-col v-for="item in items" :key="item.title" cols="auto" sm="6" md="4" lg="3">
              <v-card class="pb-3" border flat>
                <v-btn icon="mdi-delete" class="position-absolute	" style="top: 10px; right: 10px; z-index: 1;"
                  @click="deleteItem(item.raw)"></v-btn>

                <v-img :aspect-ratio="1 / 1" :src="item.raw.img"></v-img>

                <v-list-item :subtitle="item.raw.subtitle" class="mb-2">
                  <template v-slot:title>
                    <strong class="text-h6 mb-2">{{ item.raw.title }}</strong>
                  </template>
                </v-list-item>

                <div class="d-flex justify-space-between px-4">
                  <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                    <v-icon icon="mdi-clock" start></v-icon>

                    <div class="text-truncate">{{ item.raw.duration }}</div>
                  </div>

                  <v-btn class="text-none" size="small" text="查看" border flat @click="editItem(item.raw)">
                  </v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
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
    <v-dialog v-model="dialog" max-width="1200px" :persistent="loadingEdit" :fullscreen="$vuetify.display.smAndDown"
      scrollable>
      <v-card :loading="loadingEdit">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="editedItem.title" label="标题" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select v-model="editedItem.category" label="类型" :items="resourceStore.categorys" item-title="name"
                  item-value="id" :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.describe" label="描述" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12" class="report-template">
                <ckeditor v-model="editedItem.content" :editor="editor" :config="editorConfig" />
              </v-col>
            </v-row>
          </v-container>
          <small class="text-caption text-medium-emphasis" v-show="loadingEdit">* 等待中请勿关闭窗口或刷新页面</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" :disabled="loadingEdit" @click="close">
            取消
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" :loading="loadingEdit" @click="save">
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
import { computed, nextTick, reactive, ref } from 'vue';
import { ResourceApi } from '@/api/resource/resource';
import { useResourceStore } from '@/stores/resource';
import html2canvas from 'html2canvas';
import { useSettingsStore } from '@/stores/settings';
import { FileApi } from '@/api/file';

const settingsStore = useSettingsStore()
const editor = ref(ClassicEditor)
const editorConfig = reactive({
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
})
const resourceStore = useResourceStore()
defineProps({
  enableSelection: { type: Boolean, default: false }
})
const options = ref({
  page: 1,
  itemsPerPage: 5
})

const search = ref({
  name: '',
  category: null
})
import data from '@/assets/data/report-template-data.json'
const items = ref(data)
const loading = ref(true)
const loadingEdit = ref(false)
const dialogDelete = ref(false)
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  title: '',
  describe: '',
  category: null,
  content: '',
  cover: ''
})
const defaultItem = ref({
  id: null,
  title: '',
  describe: '',
  category: null,
  content: '',
  cover: ''
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增项目' : '编辑项目')

const editItem = async (item) => {
  if (item) {
    editedIndex.value = items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedItem.value.urlOld = editedItem.value.url
  } else {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  }
  dialog.value = true
}

const deleteItem = (item) => {
  editedIndex.value = items.value.indexOf(item);
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
  await ResourceApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}

const save = async () => {
  loadingEdit.value = true
  try {
    const elCkContent = document.querySelector('.ck-content')
    console.log([elCkContent])
    const canvas = await html2canvas(elCkContent,
      {
        backgroundColor: settingsStore.isDark ? '#000000' : '#ffffff',
        width: elCkContent.clientWidth,
        height: elCkContent.clientWidth
      }
    )
    console.log(canvas.toDataURL('image/png', 1.0))
    console.log(editedItem.value.content)
    const blob = new Blob([editedItem.value.content])
    const file = new File([blob], editedItem.value.title + '.txt', { type: 'text/plain' })
    const res = await FileApi.upload(file, 'simteaching/report-template/content')
    console.log(res)
    // close()
    // loadItems(options.value)
  } catch (e) { /* empty */ }
  loadingEdit.value = false
}

const loadItems = async () => {
  loading.value = true
  await resourceStore.loadCategorys()

  loading.value = false
}
</script>

<style scoped>
.report-template:deep(.ck-editor__editable_inline) {
  min-height: 300px;
  overflow-y: auto;
}
</style>
