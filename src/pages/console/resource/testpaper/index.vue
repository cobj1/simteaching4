<template>
  <VCard :elevation="enableSelection ? 0 : 1">
    <VToolbar title="试卷管理" v-if="!enableSelection">
      <ResourceCategory>
        <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
      </ResourceCategory>
      <v-btn color="primary" dark @click="editItem()">
        新增试卷
      </v-btn>
    </VToolbar>
    <v-data-table-server v-model:options="options" v-model="selected" item-value="id" :show-select="enableSelection"
      :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading"
      :search="`${search.category},${search.difficulty},${search.model},${search.name}`"
      :mobile="$vuetify.display.smAndDown" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-select hide-details v-model="search.category" class="pa-2" label="筛选类型" :items="resourceStore.categorys"
            item-title="name" item-value="id" clearable></v-select>
          <v-select hide-details v-model="search.difficulty" class="pa-2" label="筛选难易度"
            :items="testpaperStore.difficultys" clearable></v-select>
          <v-select hide-details v-model="search.model" class="pa-2" label="筛选模式" :items="testpaperStore.models"
            clearable></v-select>
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..." append-inner-icon="mdi-magnify"
            clearable></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }" v-if="!enableSelection">
        <VBtn prepend-icon="mdi-head-question" variant="text" density="comfortable" size="small"
          :to="`/console/resource/testpaper/${item.id}`">试题</VBtn>
        <VBtn prepend-icon="mdi-pencil" variant="text" density="comfortable" size="small" @click="editItem(item)">编辑
        </VBtn>
        <VBtn prepend-icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)">删除
        </VBtn>
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
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.name" label="标题" :disabled="loadingEdit"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-number-input v-model="editedItem.score" label="总分" control-variant="stacked" :min="0"
                  :max="200"></v-number-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.category" label="类型" :items="resourceStore.categorys" item-title="name"
                  item-value="id" :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.difficulty" label="难易度" :items="testpaperStore.difficultys"
                  :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="考核时间" v-model="editedItem.time" suffix="分钟"></v-text-field>
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
        <v-card-title class="text-h5">您确定要删除此试题吗？</v-card-title>
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
import { ResourceTestpaperApi } from '@/api/resource/resource-paper';
import { useResourceStore } from '@/stores/resource';
import { useTestpaperStore } from '@/stores/testpaper';

const resourceStore = useResourceStore()
const selected = defineModel()

defineProps({
  enableSelection: {
    type: Boolean,
    default: false
  }
})

const testpaperStore = useTestpaperStore()

const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([{
  title: '标题',
  key: 'name',
  sortable: false
},
{
  title: '类型',
  key: 'categoryName',
  sortable: false
},
{
  title: '难易度',
  key: 'difficulty',
  sortable: false
},
{
  title: '分数',
  key: 'score'
},
{
  title: '模式',
  key: 'model'
},
{
  title: '考核时间',
  key: 'time'
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
  difficulty: null,
  model: null
})
const serverItems = ref([])
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
  difficulty: '普通',
  model: '固定',
  score: 100,
  time: 60,
})
const defaultItem = ref({
  id: null,
  name: '',
  category: null,
  difficulty: '普通',
  model: '固定',
  score: 100,
  time: 60,
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增试卷' : '编辑试卷')

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
  } catch (e) {
    /* empty */
  }
  loadingEdit.value = false
}

const loadItems = async ({
  page,
  itemsPerPage,
  sortBy
}) => {
  loading.value = true
  await resourceStore.loadCategorys()
  const res = await ResourceTestpaperApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    category: search.value.category,
    name: search.value.name,
    difficulty: search.value.difficulty,
    model: search.value.model
  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
      categoryName: item.category ? resourceStore.categorys.find(category => category.id == item.category)
        ?.name :
        "<未分类>"
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
