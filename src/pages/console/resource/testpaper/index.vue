<template>
  <VCard>
    <VToolbar :title="title">
      <ResourceCategory>
        <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
      </ResourceCategory>
      <v-btn color="primary" dark @click="editItem()">
        新增项目
      </v-btn>
    </VToolbar>
    <v-data-table-server v-model:options="options" v-model="selected" item-value="id" :show-select="enableSelection"
      :items-per-page="options.itemsPerPage" :headers="headers" :items="serverItems" :items-length="totalItems"
      :loading="loading" :search="`${search.category},${search.name}`" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-select hide-details v-model="search.category" class="pa-2" label="筛选类型..." :items="categorys"
            item-title="name" item-value="id"></v-select>
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..."
            append-inner-icon="mdi-magnify"></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn prepend-icon="mdi-head-question" variant="text" density="comfortable" size="small"
          :to="`/console/resource/testpaper/${item.id}`">试题</VBtn>
        <VBtn prepend-icon="mdi-pencil" variant="text" density="comfortable" size="small" @click="editItem(item)">修改
        </VBtn>
        <VBtn prepend-icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)">删除
        </VBtn>
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
              <v-col cols="12">
                <v-text-field v-model="editedItem.name" label="标题" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-number-input v-model="editedItem.score" control-variant="stacked" :min="0"
                  :max="200"></v-number-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.category" label="类型" :items="categorys" item-title="name" item-value="id"
                  :disabled="loadingEdit"></v-select>
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
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { computed, nextTick, ref } from 'vue';
import { ResourceApi } from '@/api/resource';
import { ResourceTestpaperApi } from '@/api/resource-paper';
import { useRouter } from 'vue-router';

const router = useRouter()
const selected = defineModel()
const props = defineProps({
  enableSelection: { type: Boolean, default: false }
})
const title = computed(() => props.enableSelection ? '选择测试' : '测试管理')
const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([
  { title: '标题', key: 'name', sortable: false },
  { title: '类型', key: 'categoryName', sortable: false },
  { title: '分数', key: 'score' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref({
  name: '',
  category: null,
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
  name: '',
  category: null,
  score: 100,
})
const defaultItem = ref({
  id: null,
  name: '',
  category: null,
  score: 100,
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增项目' : '编辑项目')

const editItem = async (item) => {
  if (item) {
    editedIndex.value = serverItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
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
  await ResourceTestpaperApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}

const save = async () => {
  loadingEdit.value = true
  try {
    await ResourceTestpaperApi.save(editedItem.value)
    close()
    loadItems(options.value)
  } catch (e) { /* empty */ }
  loadingEdit.value = false
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  categorys.value = await ResourceApi.categorySelectAll()
  const res = await ResourceTestpaperApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    category: search.value.category,
    name: search.value.name,
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
