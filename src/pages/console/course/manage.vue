<template>
  <v-alert density="compact" icon="mdi-book-open-variant-outline" class="mb-1">
    Tip: 修改课程会进行重新审核。
  </v-alert>
  <VCard>
    <VToolbar title="课程管理">
      <ResourceCategory>
        <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
      </ResourceCategory>
      <v-btn color="primary" dark @click="addItem()">
        新增课程
      </v-btn>
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
      <!-- <template v-slot:item.cover="{ item }">
        <v-img :src="FileApi.filePath + item.cover"></v-img>
      </template> -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.cover="{ item }">
        <!-- <div class="pa-2">
          <v-img :src="item.cover" :width="80" :height="45" cover>
            <template v-slot:placeholder>
              <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
            </template>
            <template v-slot:error>
              <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
            </template>
          </v-img>
        </div> -->
        <v-img :src="FileApi.filePath + item.cover"></v-img>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.code="{ item }">
        {{ item.code }}
        <v-menu width="210px">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" :size="30" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item title="复制课程代码" prepend-icon="mdi-content-copy" link @click="copycode(item.code)">
            </v-list-item>
            <v-list-item title="重制课程代码" prepend-icon="mdi-refresh" link @click="recode(item.id)"></v-list-item>
            <v-list-item title="关闭" prepend-icon="mdi-close-box-outline" link @click="stopCodeItem(item)">
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.startTime="{ item }">
        {{ useDateFormat(item.startTime, "YYYY-MM-DD") }} - {{ useDateFormat(item.stopTime, "YYYY-MM-DD") }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.checked="{ item }">
        <v-badge v-if="item.checked == 0" dot inline color="grey">
          <span class="mr-2"> 审核中 </span>
        </v-badge>
        <v-badge v-if="item.checked == 1" dot inline color="green">
          <span class="mr-2"> 审核通过 </span>
        </v-badge>
        <v-badge v-if="item.checked == 2" dot inline color="red">
          <span class="mr-2"> 审核未通过 </span>
        </v-badge>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn prepend-icon="mdi-pencil" variant="text" text="编辑" @click="editItem(item)"></VBtn>
        <VBtn prepend-icon="mdi-delete" variant="text" text="删除" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="600px" :persistent="loadingEdit" :fullscreen="$vuetify.display.smAndDown"
      scrollable>
      <v-card :loading="loadingEdit">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-hover v-if="editedItem.cover" v-slot="{ isHovering, props }">
                  <v-card v-bind="props" color="surface-light" height="300px">
                    <v-img :src="useFileUri(editedItem.cover)" height="300px"></v-img>
                    <v-btn icon="mdi-close" class="opacity-0 position-absolute" :class="{ 'opacity-100': isHovering }"
                      style="left: 50%; top: 50%; transform: translate(-50%,-50%);" :disabled="disabled"
                      @click="editedItem.cover = null; coverFile = null"></v-btn>
                  </v-card>
                </v-hover>
                <v-file-upload v-else v-model="coverFile" :disabled="disabled" density="comfortable" title="仿真封面" height="300px"
                  accept=".png,.jpg" @update:model-value="handleCoverFileUpdate"></v-file-upload>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.name" label="标题" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.explain" label="简要说明" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.subject" label="主题" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.classroom" label="教室" :disabled="loadingEdit"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.type" label="课程种类..." :items="types" item-title="label" item-value="value"
                  :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.category" label="类型" :items="resourceStore.categorys" item-title="name"
                  item-value="id" :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12">
                <v-date-input v-model="editedItem.time" label="开放时间" multiple="range"></v-date-input>
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
    <v-dialog v-model="dialogStopCode" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">停用课程代码 </v-card-title>
        <v-card-subtitle>这样会移除此课程现有的课程代码。您可以在课程设置中生成新的代码。</v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeStepCode">取消</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="stopCodeItemConfirm">确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </VCard>

</template>

<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'
import { computed, nextTick, ref } from 'vue';
import { CourseApi } from '@/api/course/course';
import { useClipboard, useDateFormat } from '@vueuse/core';
import { useResourceStore } from '@/stores/resource';
import { TimeRangeGenerators } from '@/utils/time-range-generators';

import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { FileApi } from '@/api/file';
import { useFileUri } from '@/utils/simulation-uri';
import { useObjectUrl } from '@vueuse/core';
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
const resourceStore = useResourceStore()
const { copy } = useClipboard()
const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([
{ 
  title: '仿真封面', align: 'start', sortable: false, key: 'cover', nowrap: true },
  // { title: '封面', key: 'cover', sortable: false, },
  { title: '标题', key: 'name', },
  { title: '主题', key: 'subject', },
  { title: '教室', key: 'classroom', },
  { title: '类型', key: 'categoryName', sortable: false },
  { title: '种类', key: 'typeName', sortable: false },
  { title: '课程代码', key: 'code' },
  { title: '开放时间', key: 'startTime' },
  { title: '审核状态', key: 'checked' },
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
const loadingEdit = ref(false)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialog = ref(false)
const dialogStopCode = ref(false)
const editedIndex = ref(-1)
const coverFile = ref(null)

const editedItem = ref({
  id: null,
  name: '',
  type: 'general',
  category: null,
  explain: '',
  subject: '',
  classroom: '',
  cover: '',
  time: []
})
const defaultItem = ref({
  id: null,
  name: '',
  type: 'general',
  category: null,
  explain: '',
  subject: '',
  classroom: '',
  cover: '',
  time: []
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增课程' : '编辑课程')
const addItem = () => {

  coverFile.value = null
  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1;  
  dialog.value = true
}
const editItem = async (item) => {
  if (item) {
    editedIndex.value = serverItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedItem.value.time = TimeRangeGenerators(item.startTime, item.stopTime)
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
const stopCodeItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogStopCode.value = true;
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
const closeStepCode = () => {
  dialogStopCode.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  })
}

const deleteItemConfirm = async () => {
  await CourseApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}
const stopCodeItemConfirm = async () => {
  await CourseApi.stopcode(editedItem.value.id)
  loadItems(options.value)
  closeStepCode()
}

const recode = async (id) => {
  await CourseApi.recode(id)
  loadItems(options.value)
}

const copycode = (code) => {
  copy(code)
}

const save = async () => {
  loadingEdit.value = true
  try {
    await CourseApi.save({
      ...editedItem.value,
      startTime: editedItem.value.time[0],
      stopTime: editedItem.value.time.at(-1)
    })
    close()
    loadItems(options.value)
  } catch (e) { /* empty */ }
  loadingEdit.value = false
}

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
const handleCoverFileUpdate = (file) => {
  editedItem.value.cover = useObjectUrl(file).value
}
</script>

<style scoped></style>
