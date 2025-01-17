<template>
  <v-alert density="compact" icon="mdi-book-open-variant-outline" class="mb-1">
    Tip: 修改实验申报会进行重新审核。
  </v-alert>
  <VCard>
    <VToolbar title="申报管理">
      <v-btn color="primary" @click="addItem()">
        新增申报项目
      </v-btn>
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
      <template v-slot:item.checkStatus="{ item }">
        <v-badge v-if="item.checkStatus == 0" dot inline color="grey">
          <span class="mr-2"> 审核中 </span>
        </v-badge>
        <v-badge v-if="item.checkStatus == 1" dot inline color="green">
          <span class="mr-2"> 审核通过 </span>
        </v-badge>
        <v-badge v-if="item.checkStatus == 2" dot inline color="red">
          <span class="mr-2"> 审核未通过 </span>
        </v-badge>
        <v-tooltip v-if="item.checkMsg" :text="item.checkMsg">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" icon="mdi-help-circle-outline" size="20px" class="ml-2"></v-icon>
          </template>
        </v-tooltip>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn prepend-icon="mdi-pencil" variant="text" text="编辑" @click="editItem(item)"></VBtn>
        <VBtn prepend-icon="mdi-delete" variant="text" text="删除" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" :persistent="saving" max-width="1200px" :fullscreen="$vuetify.display.smAndDown"
      scrollable>
      <v-card :loading="saving">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <VDivider></VDivider>
        <v-card-text>
          <declare-edit v-model:editedItem="editedItem" v-model:editedItemDetails="editedItemDetails"
            v-model:coverFile="coverFile" v-model:introVideoFile="introVideoFile"
            v-model:guideVideoFile="guideVideoFile" :disabled="saving"></declare-edit>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <small v-show="saving" class="text-caption text-medium-emphasis">*保存过程会提交文件请耐心等待。</small>
          <v-spacer></v-spacer>
          <v-btn variant="text" :disabled="saving" @click="close">
            取消
          </v-btn>
          <v-btn color="surface-variant" variant="flat" :loading="saving" @click="save">
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
import { DeclareApi } from '@/api/declare';
import { FileApi } from '@/api/file';

const options = ref({
  page: 1,
  itemsPerPage: 5
})
const headers = ref([
  { title: '仿真封面', align: 'start', sortable: false, key: 'cover', nowrap: true },
  { title: '实验名称', align: 'start', sortable: false, key: 'name', nowrap: true },
  { title: '作者', key: 'author', nowrap: true },
  { title: '组织', key: 'org', nowrap: true },
  { title: '专业类型', key: 'category', nowrap: true },
  { title: '实验类型', key: 'type', nowrap: true },
  { title: '审核状态', key: 'checkStatus', nowrap: true },
  { title: '发布时间', key: 'createTime', nowrap: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', nowrap: true },
])
const search = ref({
  name: '',
  teamName: ''
})
const serverItems = ref([])
const loading = ref(true)
const saving = ref(false)
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
  intro: '',
  details: ''
})
const editedItemDetails = ref({
  id: '',
  introVideo: '',
  guideVideo: '',
  deviceCondition: '',
  target: '',
  principle: '',
  steps: '',
  team: []
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
  intro: '',
  details: ''
})
const defaultItemDetails = ref({
  id: '',
  introVideo: '',
  guideVideo: '',
  deviceCondition: '',
  target: '',
  principle: '',
  steps: '',
  team: []
})
const coverFile = ref(null)
const introVideoFile = ref(null)
const guideVideoFile = ref(null)

const formTitle = computed(() => editedIndex.value === -1 ? '新增申报项目' : '修改申报项目')

const addItem = () => {
  editedItem.value = Object.assign({}, defaultItem.value)
  editedItemDetails.value = Object.assign({}, defaultItemDetails.value)
  editedIndex.value = -1;
  coverFile.value = null
  introVideoFile.value = null
  guideVideoFile.value = null
  dialog.value = true
}

const editItem = async (item) => {
  editedIndex.value = serverItems.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  editedItemDetails.value = Object.assign({}, defaultItemDetails.value)
  coverFile.value = null
  introVideoFile.value = null
  guideVideoFile.value = null

  const itemDetails = await DeclareApi.detailsInfo(item.id)
  editedItemDetails.value.id = itemDetails.id
  editedItemDetails.value.introVideo = itemDetails.introVideo
  editedItemDetails.value.guideVideo = itemDetails.guideVideo
  FileApi.downloadTxt(itemDetails.team).then(res => editedItemDetails.value.team = JSON.parse(res))
  FileApi.downloadTxt(itemDetails.deviceCondition).then(res => editedItemDetails.value.deviceCondition = res)
  FileApi.downloadTxt(itemDetails.target).then(res => editedItemDetails.value.target = res)
  FileApi.downloadTxt(itemDetails.principle).then(res => editedItemDetails.value.principle = res)
  FileApi.downloadTxt(itemDetails.steps).then(res => editedItemDetails.value.steps = res)

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
    editedItemDetails.value = Object.assign({}, defaultItemDetails.value)
    editedIndex.value = -1
    coverFile.value = null
    introVideoFile.value = null
    guideVideoFile.value = null
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
  saving.value = true

  if (coverFile.value) {
    const coverConfig = await FileApi.upload(coverFile.value, 'simteaching/declare/cover', true)
    editedItem.value.cover = coverConfig.url
  }
  const did = await DeclareApi.save({
    id: editedItem.value.id,
    cover: editedItem.value.cover,
    name: editedItem.value.name,
    uri: editedItem.value.uri,
    author: editedItem.value.author,
    org: editedItem.value.org,
    category: editedItem.value.category,
    type: editedItem.value.type,
    intro: editedItem.value.intro,
    details: editedItem.value.details,
  })

  if (introVideoFile.value) {
    const introVideoConfig = await FileApi.upload(introVideoFile.value, 'simteaching/declare/intro-video', true)
    editedItemDetails.value.introVideo = introVideoConfig.url
  }

  if (guideVideoFile.value) {
    const guideVideoConfig = await FileApi.upload(guideVideoFile.value, 'simteaching/declare/guide-video', true)
    editedItemDetails.value.guideVideo = guideVideoConfig.url
  }

  const teamBlob = new Blob([JSON.stringify(editedItemDetails.value.team)])
  const teamFile = new File([teamBlob], 'team.txt', { type: 'text/plain' })
  const teamConfig = await FileApi.upload(teamFile, 'simteaching/declare/team', true)

  const deviceConditionBlob = new Blob([editedItemDetails.value.deviceCondition])
  const deviceConditionFile = new File([deviceConditionBlob], 'device-condition.txt', { type: 'text/plain' })
  const deviceConditionConfig = await FileApi.upload(deviceConditionFile, 'simteaching/declare/device-condition', true)

  const targetBlob = new Blob([editedItemDetails.value.target])
  const targetFile = new File([targetBlob], 'target.txt', { type: 'text/plain' })
  const targetConfig = await FileApi.upload(targetFile, 'simteaching/declare/target', true)

  const principleBlob = new Blob([editedItemDetails.value.principle])
  const principleFile = new File([principleBlob], 'principle.txt', { type: 'text/plain' })
  const principleConfig = await FileApi.upload(principleFile, 'simteaching/declare/principle', true)

  const stepsBlob = new Blob([editedItemDetails.value.steps])
  const stepsFile = new File([stepsBlob], 'steps.txt', { type: 'text/plain' })
  const stepsConfig = await FileApi.upload(stepsFile, 'simteaching/declare/steps', true)

  await DeclareApi.detailsSave({
    id: editedItemDetails.value.id,
    did,
    introVideo: editedItemDetails.value.introVideo,
    guideVideo: editedItemDetails.value.guideVideo,
    deviceCondition: deviceConditionConfig.url,
    target: targetConfig.url,
    principle: principleConfig.url,
    steps: stepsConfig.url,
    team: teamConfig.url,
  })

  saving.value = false
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

<style scoped>
.declare-documents:deep(.ck-editor__editable_inline) {
  min-height: 300px;
  overflow-y: auto;
}
</style>
