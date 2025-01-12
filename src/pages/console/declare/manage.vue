<template>
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
      <template v-slot:item.actions="{ item }">
        <VBtn prepend-icon="mdi-pencil" variant="text" text="编辑" @click="editItem(item)"></VBtn>
        <VBtn prepend-icon="mdi-delete" variant="text" text="删除" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="1200px" :fullscreen="$vuetify.display.smAndDown" scrollable>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <VDivider></VDivider>
        <v-card-text>
          <v-container class="declare-documents">
            <v-row>
              <v-col cols="12">
                <v-hover v-if="editedItem.cover" v-slot="{ isHovering, props }">
                  <v-card v-bind="props" color="surface-light" height="300px">
                    <v-img :src="FileApi.filePath + editedItem.cover" height="300px"></v-img>
                    <v-btn icon="mdi-close" class="opacity-0 position-absolute" :class="{ 'opacity-100': isHovering }"
                      style="left: 50%; top: 50%; transform: translate(-50%,-50%);"
                      @click="editedItem.cover = null; coverFile = null"></v-btn>
                  </v-card>
                </v-hover>
                <v-file-upload v-else v-model="coverFile" density="comfortable" title="封面" height="300px"
                  accept=".png,.jpg" @update:model-value="handleCoverFileUpdate"></v-file-upload>
              </v-col>
              <v-col cols="12" sm="12">
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
              <v-col cols="12" sm="8">
                <v-text-field v-model="editedItem.uri" label="实验链接(uri)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn :prepend-icon="IconsAdapter('simulation')" size="x-large" width="100%">
                  选择仿真实验
                  <SelectionSimulation @confirm="handleSelectionSimulationConfirm"></SelectionSimulation>
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.intro" label="简介"></v-text-field>
              </v-col>
              <v-col cols="12">
                <VVideo v-model:intro-video="editedItemDetails.introVideo"
                  v-model:guide-video="editedItemDetails.guideVideo" v-model:intro-video-file="introVideoFile"
                  v-model:guide-video-file="guideVideoFile">
                </VVideo>
              </v-col>
              <v-col cols="12">
                <VTeam v-model="editedItemDetails.team"></VTeam>
              </v-col>
              <v-col cols="12">
                <v-responsive class="text-center mx-auto my-10" max-width="700">
                  <p class="font-weight-bold text-h4 mb-2">设备要求</p>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    满足电脑设备要求，可以确保软件正常运行，获得最佳使用体验，提高工作效率，并避免不必要的经济损失。
                  </p>
                </v-responsive>
                <ckeditor v-model="editedItemDetails.deviceCondition" :editor="editor" :config="editorConfig" />
              </v-col>
              <v-col cols="12">
                <v-responsive class="text-center mx-auto my-10" max-width="700">
                  <p class="font-weight-bold text-h4 mb-2">教学目标</p>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    教学目标在科学教育中具有重要的地位和作用。它不仅可以帮助学生更好地理解和掌握科学知识，更重要的是可以培养学生的科学素养、实践能力、创新意识和探究精神，为他们未来的学习和发展打下坚实的基础。
                  </p>
                </v-responsive>
                <ckeditor v-model="editedItemDetails.target" :editor="editor" :config="editorConfig" />
              </v-col>
              <v-col cols="12">
                <v-responsive class="text-center mx-auto my-10" max-width="700">
                  <p class="font-weight-bold text-h4 mb-2">实验原理</p>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    实验原理的重要性体现在各个方面，它不仅是科学研究的重要手段，也是工程技术进步的重要推动力，同时对我们的日常生活也有着重要的意义。通过实验，我们可以更好地认识世界、改造世界，不断推动社会的发展和进步。
                  </p>
                </v-responsive>
                <ckeditor v-model="editedItemDetails.principle" :editor="editor" :config="editorConfig" />
              </v-col>
              <v-col cols="12">
                <v-responsive class="text-center mx-auto my-10" max-width="700">
                  <p class="font-weight-bold text-h4 mb-2">实验步骤</p>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    实验步骤是实验成功的关键。无论是科学研究还是学习，都应该重视实验步骤的制定和执行，以确保实验结果的准确性、可靠性和有效性，并培养科学思维和探究能力。
                  </p>
                </v-responsive>
                <ckeditor v-model="editedItemDetails.steps" :editor="editor" :config="editorConfig" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="close">
            取消
          </v-btn>
          <v-btn color="surface-variant" variant="flat" @click="save">
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
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { computed, nextTick, reactive, ref } from 'vue';
import { DeclareApi } from '@/api/declare';
import { IconsAdapter } from '@/utils/icons-adapter';
import { ResourceSimulationApi } from '@/api/resource/resource-simulation';
import { SimulationUri } from '@/utils/simulation-uri';
import { useObjectUrl } from '@vueuse/core';
import { FileApi } from '@/api/file';
import { useConsoleStore } from '@/stores/console';

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
  { title: '仿真封面', align: 'start', sortable: false, key: 'cover', },
  { title: '实验名称', align: 'start', sortable: false, key: 'name', },
  { title: '作者', key: 'author' },
  { title: '组织', key: 'org' },
  { title: '专业类型', key: 'category', },
  { title: '实验类型', key: 'type', },
  { title: '审核状态', key: 'check_status', },
  { title: '发布时间', key: 'createTime', },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref({
  name: '',
  teamName: ''
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
  intro: ''
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
  intro: ''
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

const handleSelectionSimulationConfirm = async (seleted) => {
  if (seleted.at(0)) {
    const res = await ResourceSimulationApi.info(seleted.at(0))
    editedItem.value.uri = SimulationUri(res.url)
  }
}
const handleCoverFileUpdate = (file) => {
  editedItem.value.cover = useObjectUrl(file).value
}

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

  const itemDetails = {
    "id": null,
    "introVideo": "simteaching/declare/guide-video/78056027-a6e0-44f0-977a-f4ac9e6fbc50.mp4",
    "guideVideo": "simteaching/declare/guide-video/78056027-a6e0-44f0-977a-f4ac9e6fbc50.mp4",
    "team": 'simteaching/declare/team/df60657d-dadf-4df3-936e-2d90413788c7.txt',
    "deviceCondition": "simteaching/declare/device-condition/2c5cfac1-59eb-4956-8b69-e2b093383ed9.txt",
    "target": "simteaching/declare/target/cd34505c-2989-423e-b17c-0573ba1579ce.txt",
    "principle": "simteaching/declare/principle/7a67fbd7-5f33-4516-8157-3483a4f6fb73.txt",
    "steps": "simteaching/declare/steps/4ee46cca-ab48-476e-92b6-a21efb3128f7.txt"
  }

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
  console.log(editedItem.value)
  if (coverFile.value) {
    const coverConfig = await FileApi.upload(coverFile.value, 'simteaching/declare/cover')
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
  })

  if (introVideoFile.value) {
    const introVideoConfig = await FileApi.upload(introVideoFile.value, 'simteaching/declare/intro-video')
    editedItemDetails.value.introVideo = introVideoConfig.url
  }

  if (introVideoFile.value) {
    const guideVideoConfig = await FileApi.upload(introVideoFile.value, 'simteaching/declare/guide-video')
    editedItemDetails.value.introVideo = guideVideoConfig.url
  }

  const teamBlob = new Blob([JSON.stringify(editedItemDetails.value.team)])
  const teamFile = new File([teamBlob], 'team.txt', { type: 'text/plain' })
  const teamConfig = await FileApi.upload(teamFile, 'simteaching/declare/team')

  const deviceConditionBlob = new Blob([editedItemDetails.value.deviceCondition])
  const deviceConditionFile = new File([deviceConditionBlob], 'device-condition.txt', { type: 'text/plain' })
  const deviceConditionConfig = await FileApi.upload(deviceConditionFile, 'simteaching/declare/device-condition')

  const targetBlob = new Blob([editedItemDetails.value.target])
  const targetFile = new File([targetBlob], 'target.txt', { type: 'text/plain' })
  const targetConfig = await FileApi.upload(targetFile, 'simteaching/declare/target')

  const principleBlob = new Blob([editedItemDetails.value.principle])
  const principleFile = new File([principleBlob], 'principle.txt', { type: 'text/plain' })
  const principleConfig = await FileApi.upload(principleFile, 'simteaching/declare/principle')

  const stepsBlob = new Blob([editedItemDetails.value.steps])
  const stepsFile = new File([stepsBlob], 'steps.txt', { type: 'text/plain' })
  const stepsConfig = await FileApi.upload(stepsFile, 'simteaching/declare/steps')

  await DeclareApi.detailsSave({
    did,
    introVideo: editedItemDetails.value.introVideo,
    guideVideo: editedItemDetails.value.introVideo,
    deviceCondition: deviceConditionConfig.url,
    target: targetConfig.url,
    principle: principleConfig.url,
    steps: stepsConfig.url,
    team: teamConfig.url,
  })
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
