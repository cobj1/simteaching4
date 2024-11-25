<template>
  <VCard>
    <VToolbar title="仿真">
      <ResourceCoursewareCategory>
        <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
      </ResourceCoursewareCategory>
      <v-btn color="primary" dark @click="editItem()">
        新增项目
      </v-btn>
    </VToolbar>
    <v-data-table-server v-model:options="options" :items-per-page="options.itemsPerPage" :headers="headers"
      :items="serverItems" :items-length="totalItems" :loading="loading" :search="`${search.category},${search.name}`"
      item-value="name" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-select v-model="search.category" class="pa-2" label="筛选类型..." :items="categorys" item-title="name"
            item-value="id"></v-select>
          <v-text-field v-model="search.name" class="pa-2" label="检索..."></v-text-field>
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
      <template v-slot:item.actions="{ item }">
        <VBtn icon="mdi-pencil" variant="text" density="comfortable" size="small" @click="editItem(item)"></VBtn>
        <VBtn icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="600px" :persistent="loadingEdit">
      <v-card :loading="loadingEdit">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.name" label="标题" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.appid" label="Appid" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.category" label="类型" :items="categorys" item-title="name" item-value="id"
                  :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.type" label="种类" :items="['WebGL']" :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.cover" label="封面(url)" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input v-model="editedItem.file" label="根节点包含index.html文件，选择文件(Zip)..." :disabled="loadingEdit"
                  accept=".zip">
                  <template #details v-if="editedItem.url">
                    <small class="text-caption text-medium-emphasis" style="word-break:break-all;"> {{ FileApi.filePath
                      + editedItem.url }}</small>
                  </template>>
                </v-file-input>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedItem.introduce" label="简介" :disabled="loadingEdit"></v-textarea>
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
import ResourceCoursewareCategory from '@/components/ResourceCoursewareCategory.vue';
import { computed, nextTick, ref } from 'vue';
import { ResourceApi } from '@/api/resource';
import { FileApi } from '@/api/file';
import { ResourceSimulationApi } from '@/api/resource-simulation';
import { VImg } from 'vuetify/components';
import { useDateFormat, useNow } from '@vueuse/core';

const options = ref({
  page: 1,
  itemsPerPage: 5
})
const headers = ref([
  { title: '封面', key: 'cover', sortable: false, },
  { title: '标题', key: 'name', sortable: false, },
  { title: '类型', key: 'categoryName', sortable: false, },
  { title: '种类', key: 'type', },
  { title: '大小', key: 'size' },
  { title: 'Appid', key: 'appid' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref({
  name: '',
  category: null
})
const serverItems = ref([])
const categorys = ref([])
const loading = ref(true)
const loadingEdit = ref(false)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialog = ref(false)
const editedIndex = ref(-1)

const editedItem = ref({
  id: null,
  cover: '',
  name: '',
  appid: '',
  type: 'WebGL',
  category: null,
  introduce: '',
  url: null,
  urlOld: null,
  size: null,
  file: null
})
const defaultItem = ref({
  id: null,
  cover: '',
  name: '',
  appid: '',
  type: 'WebGL',
  category: null,
  introduce: '',
  url: null,
  urlOld: null,
  size: null,
  file: null
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增项目' : '编辑项目')

const editItem = async (item) => {
  if (item) {
    editedIndex.value = serverItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedItem.value.urlOld = editedItem.value.url
  } else {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
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
  await ResourceSimulationApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}

const save = async () => {
  loadingEdit.value = true
  try {
    if (editedItem.value.file) {
      const res = await FileApi.upload(editedItem.value.file, 'simulation-zip')
      const dateDirectory = useDateFormat(useNow(), "YYYY/MM/DD")
      editedItem.value.url = `simulation-unzip/${dateDirectory.value}/${res.id}/index.html`
      editedItem.value.size = res.size
      if (editedItem.value.urlOld) {
        const indexDirectory = editedItem.value.urlOld.substring(0, editedItem.value.urlOld.lastIndexOf('/index.html'))
        const fileId = indexDirectory.substring(indexDirectory.lastIndexOf('/') + 1)
        FileApi.delete(`simulation-zip/${fileId}.zip`)
        FileApi.delete(`${indexDirectory}/`)
      }
    }
    await ResourceSimulationApi.save(editedItem.value)
    close()
    loadItems(options.value)
  } catch (e) { /* empty */ }
  loadingEdit.value = false
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  categorys.value = await ResourceApi.categorySelectAll()
  const res = await ResourceSimulationApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    category: search.value.category,
    name: search.value.name
  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
      categoryName: item.category ? categorys.value.find(category => category.id == item.category)?.name
        : "<未分类>"
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
