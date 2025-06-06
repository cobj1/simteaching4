<template>
  <VCard :elevation="enableSelection ? 0 : 1">
    <VToolbar title="题库管理" v-if="!enableSelection">
      <ResourceCategory>
        <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
      </ResourceCategory>
      <v-btn color="primary" dark @click="editItem()">
        新增题目
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-database-import" dark>
        批量导入
        <batch-questions @change="handleBatchQuestionsChange"></batch-questions>
      </v-btn>
    </VToolbar>
    <v-data-table-server v-model:options="options" v-model="selected" item-value="id" :show-select="enableSelection"
      :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading"
      :search="`${search.category},${search.type},${search.difficulty},${search.name}`"
      :mobile="$vuetify.display.smAndDown" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-select hide-details v-model="search.category" class="pa-2" label="筛选类型..." :items="resourceStore.categorys"
            item-title="name" item-value="id" clearable></v-select>
          <v-select hide-details v-model="search.type" class="pa-2" label="筛选题型..." :items="questionsStore.types"
            clearable></v-select>
          <v-select hide-details v-model="search.difficulty" class="pa-2" label="筛选难易度..."
            :items="questionsStore.difficultys" clearable></v-select>
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..." append-inner-icon="mdi-magnify"
            clearable></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }" v-if="!enableSelection">
        <VBtn icon="mdi-pencil" variant="text" density="comfortable" size="small" @click="editItem(item)"></VBtn>
        <VBtn icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)"></VBtn>
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
                <v-text-field v-model="editedItem.name" label="标题" :disabled="loadingEdit"></v-text-field>
                <v-file-input v-model="editedItem.attachmentFile" label="标题附件: 图片/视频" :disabled="loadingEdit"
                  accept=".mp4,.jpg,.png">
                  <template #details v-if="editedItem.attachment">
                    <small class="text-caption text-medium-emphasis" style="word-break:break-all;">
                      {{ useFileUri(editedItem.attachment) }}
                    </small>
                  </template>>
                </v-file-input>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select v-model="editedItem.type" label="题型" :items="questionsStore.types"
                  :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select v-model="editedItem.difficulty" label="难易度" :items="questionsStore.difficultys"
                  :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select v-model="editedItem.category" label="类型" :items="resourceStore.categorys" item-title="name"
                  item-value="id" :disabled="loadingEdit"></v-select>
              </v-col>
              <v-col cols="12">
                <QuestionsOptions :type="editedItem.type" v-model:answer="editedItem.answer"
                  v-model:options="editedItem.options" v-model:simulation="editedItem.simulation" editor>
                </QuestionsOptions>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedItem.answerAnalysis" label="答案解析" :disabled="loadingEdit"></v-textarea>
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
import { ResourceQuestionsApi } from '@/api/resource/resource-questions';
import { useAnswerFormat } from '@/utils/answer-format';
import { useResourceStore } from '@/stores/resource';
import { useQuestionsStore } from '@/stores/questions';
import { useFileUri } from '@/utils/simulation-uri';
import { FileApi } from '@/api/file';

const questionsStore = useQuestionsStore()
const resourceStore = useResourceStore()
const selected = defineModel()
defineProps({
  enableSelection: { type: Boolean, default: false }
})
const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([
  { title: '标题', key: 'name', sortable: false },
  { title: '类型', key: 'categoryName', sortable: false },
  { title: '题型', key: 'type' },
  { title: '难易度', key: 'difficulty' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref({
  name: '',
  category: null,
  type: null,
  difficulty: null
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
  type: '单选题',
  category: null,
  difficulty: '普通',
  answer: null,
  answerAnalysis: '',
  options: [],
  simulation: null,
  attachmentFile: null,
  attachment: null,
  attachmentOld: null
})
const defaultItem = ref({
  id: null,
  name: '',
  type: '单选题',
  category: null,
  difficulty: '普通',
  answer: null,
  answerAnalysis: '',
  options: [],
  simulation: null,
  attachmentFile: null,
  attachment: null,
  attachmentOld: null
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增试题' : '编辑试题')

const handleBatchQuestionsChange = () => {
  loadItems(options.value)
}

const editItem = async (item) => {
  if (item) {
    editedIndex.value = serverItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedItem.value.answer = useAnswerFormat(item.answer, item.type)
    const res = await ResourceQuestionsApi.info(item.id)
    editedItem.value.options = res.options.map(item => item.name)
    editedItem.value.simulation = res.simulation
    editedItem.value.attachmentOld = editedItem.value.attachment
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
  await ResourceQuestionsApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}

const save = async () => {
  loadingEdit.value = true
  try {
    if (editedItem.value.attachmentFile) {
      const res = await FileApi.upload(editedItem.value.attachmentFile, 'simteaching/resource/questions')
      editedItem.value.attachment = res.url
      if (editedItem.value.attachmentOld) FileApi.delete(editedItem.value.attachmentOld)
    }
    await ResourceQuestionsApi.save(editedItem.value)
    close()
    loadItems(options.value)
  } catch (e) { /* empty */ }
  loadingEdit.value = false
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  await resourceStore.loadCategorys()
  const res = await ResourceQuestionsApi.page({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    category: search.value.category,
    name: search.value.name,
    type: search.value.type,
    difficulty: search.value.difficulty
  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
      categoryName: item.category ? resourceStore.categorys.find(category => category.id == item.category)?.name
        : "<未分类>"
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
