<template>
  <VCard>
    <VToolbar title="申报审核">
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
      <template v-slot:item.actions="{ item }">
        <VBtn prepend-icon="mdi-clipboard-check-outline" variant="text" text="审核" @click="checkItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialogCheck" max-width="1200" :fullscreen="$vuetify.display.smAndDown" scrollable>
      <v-card rounded="lg" title="审核实验申报">
        <template #prepend>
          <v-avatar color="warning" icon="mdi-alert-outline" variant="tonal" />
        </template>
        <template #text>
          <div class="mb-4 text-body-2 text-medium-emphasis">
            审核实验申报是保障科研质量、维护科研诚信、促进科研发展的重要环节，对于保障受试者安全和权益、提高实验质量和效率、维护科研声誉、符合法规和政策要求等方面都具有重要意义。
          </div>
          <declare-view v-model:editedItem="editedItem" v-model:editedItemDetails="editedItemDetails"></declare-view>
        </template>
        <v-divider />
        <div class="pa-4 d-flex justify-center flex-column align-center">
          <v-radio-group v-model="checkdItem.status" inline hide-details>
            <v-radio label="审核通过" :value="1"></v-radio>
            <v-radio label="审核不通过" :value="2"></v-radio>
          </v-radio-group>
          <v-text-field v-if="checkdItem.status == 2" v-model="checkdItem.message" label="审核不通过原因" variant="outlined"
            hide-details class="mt-2 w-100"></v-text-field>
        </div>
        <v-divider />
        <template #actions>
          <v-spacer />
          <v-btn border class="text-none" color="surface" text="取消" variant="flat" @click="closeCheck" />
          <v-btn class="text-none" color="warning" text="提交审核" variant="flat" @click="confirmCheck" />
        </template>
      </v-card>
    </v-dialog>
  </VCard>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { FileApi } from '@/api/file';
import { DeclareApi } from '@/api/declare';

const options = ref({
  page: 1,
  itemsPerPage: 5
})
const headers = ref([
  { title: '仿真封面', align: 'start', sortable: false, key: 'cover', nowrap: true },
  { title: '实验名称', align: 'start', sortable: false, key: 'title', nowrap: true },
  { title: '作者', key: 'author', nowrap: true },
  { title: '组织', key: 'org', nowrap: true },
  { title: '专业类型', key: 'category', nowrap: true },
  { title: '实验类型', key: 'type', nowrap: true },
  { title: '发布时间', key: 'createTime', nowrap: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end', nowrap: true },
])
const search = ref({
  name: ''
})
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialogCheck = ref(false)
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

const checkdItem = ref({
  status: 1,
  message: ''
})
const defaultCheckdItem = ref({
  status: 1,
  message: ''
})

const checkItem = async (item) => {
  editedItem.value = Object.assign({}, item)
  editedItemDetails.value = Object.assign({}, defaultItemDetails.value)
  checkdItem.value = Object.assign({}, defaultCheckdItem.value)

  const itemDetails = await DeclareApi.detailsInfo(item.id)
  editedItemDetails.value.id = itemDetails.id
  editedItemDetails.value.introVideo = itemDetails.introVideo
  editedItemDetails.value.guideVideo = itemDetails.guideVideo
  FileApi.downloadTxt(itemDetails.team).then(res => editedItemDetails.value.team = JSON.parse(res))
  FileApi.downloadTxt(itemDetails.deviceCondition).then(res => editedItemDetails.value.deviceCondition = res)
  FileApi.downloadTxt(itemDetails.target).then(res => editedItemDetails.value.target = res)
  FileApi.downloadTxt(itemDetails.principle).then(res => editedItemDetails.value.principle = res)
  FileApi.downloadTxt(itemDetails.steps).then(res => editedItemDetails.value.steps = res)

  editedItem.value.status = 1
  dialogCheck.value = true;
}

const closeCheck = () => {
  dialogCheck.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedItemDetails.value = Object.assign({}, defaultItemDetails.value)
    checkdItem.value = Object.assign({}, defaultCheckdItem.value)
  })
}

const confirmCheck = async () => {
  await DeclareApi.check(editedItem.value.id, checkdItem.value.status, checkdItem.value.message)
  loadItems(options.value)
  closeCheck()
}
const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const res = await DeclareApi.page({
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

<style scoped></style>
