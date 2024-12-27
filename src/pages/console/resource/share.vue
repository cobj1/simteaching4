<template>
  <VCard>
    <VToolbar :title="title">
      <v-btn color="primary" dark @click="sharedResourcesDialog = true">共享资源</v-btn>
    </VToolbar>
    <div class="d-flex flex-wrap">
      <v-btn-toggle v-model="search.self" class="ma-2 " style="height: 58px;">
        <v-btn :value="false" height="58px">
          全部资源
        </v-btn>
        <v-btn :value="true" height="58px">
          共享的资源
        </v-btn>
      </v-btn-toggle>
      <v-select hide-details v-model="search.type" class="pa-2" label="筛选类型..." :items="types" item-title="title"
        item-value="value" clearable></v-select>
      <v-combobox hide-details v-model="search.category" :items="categorys" class="pa-2" label="筛选种类..."
        item-title="title" multiple max-width="50%" clearable></v-combobox>
      <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..."
        append-inner-icon="mdi-magnify" clearable></v-text-field>
    </div>
    <v-layout>
      <v-navigation-drawer v-model="drawer" temporary location="right" width="360">
        <v-img height="200" width="100%" v-if="drawerItem.cover && FileFormat(drawerItem.cover) == 'picture'"
          :src="FileApi.filePath + drawerItem.cover"></v-img>
        <VDivider v-if="drawerItem.cover && FileFormat(drawerItem.cover) == 'picture'"></VDivider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-file-outline" :title="drawerItem.rname"></v-list-item>
          <v-list-item prepend-icon="mdi-calendar-range" :subtitle="`共享时间: ${drawerItem.createTime}`"></v-list-item>
          <v-list-item prepend-icon="mdi-format-list-bulleted-type"
            :subtitle="`文件类型: ${typeLabel(drawerItem.type)}`"></v-list-item>
          <v-list-item prepend-icon="mdi-account-outline" :subtitle="`分享人: ${drawerItem.creatorName}`"></v-list-item>
          <v-list-item prepend-icon="mdi-bank" :subtitle="`组织: ${drawerItem.orgName}`"
            v-if="drawerItem.orgName"></v-list-item>
        </v-list>
        <v-btn color="primary" class="d-flex mx-auto" prepend-icon="mdi-plus"
          @click="joinTheRepository(drawerItem)">加入资源库</v-btn>
        <v-btn color="error" class="d-flex mx-auto mt-4" prepend-icon="mdi-delete" v-if="drawerItem.self"
          @click="dialogDeleteShareResource = true">取消资源共享</v-btn>
      </v-navigation-drawer>
      <v-main height="calc(100vh - 240px)">
        <v-infinite-scroll height="calc(100vh - 280px)" @load="loadItems">
          <v-sheet class="pa-4 ga-4" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr))">
            <v-sheet v-for="(item) in items" :key="item.id">
              <v-card width="300" hover class="mx-auto" :class="{ 'w-100': $vuetify.display.smAndDown }"
                @click.stop="viewItem(item)">
                <FileIcon :cover="item.cover"></FileIcon>
                <v-card-title>
                  {{ item.rname }}
                </v-card-title>
                <v-card-subtitle>
                  {{ item.creatorName }}
                  <span v-if="item.orgName"> | {{ item.orgName }}</span>
                </v-card-subtitle>
                <v-card-actions class="px-4">
                  <v-icon icon="mdi-file-plus" size="small"></v-icon>
                  <div class="text-caption">0</div>
                  <v-spacer></v-spacer>
                  <v-btn color="medium-emphasis" prepend-icon="mdi-plus" size="small"
                    @click.stop="joinTheRepository(item)">加入资源库</v-btn>
                </v-card-actions>
                <v-chip class="position-absolute top-0 rounded-bs-0	" label>
                  <v-icon icon="mdi-label" start></v-icon>
                  <span>{{ typeLabel(item.type) }}</span>
                  {{ item.category ? '&nbsp;-&nbsp;' + item.category : '' }}
                </v-chip>
              </v-card>
            </v-sheet>
          </v-sheet>
          <template v-slot:empty>
            <v-empty-state v-if="items.length == 0" icon="mdi-magnify"
              text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
              title="We couldn't find a match."></v-empty-state>
            <VSheet v-else class="d-flex ga-2">
              <v-icon icon="mdi-check-circle-outline"></v-icon>
              已全部加载
            </VSheet>
          </template>
        </v-infinite-scroll>
        <VDivider></VDivider>
        <div class="text-body-2 pa-2 text-end">
          <strong>Totle:</strong> {{ totalItems }}
        </div>
      </v-main>
    </v-layout>
    <v-dialog v-model="sharedResourcesDialog" max-width="600">
      <v-card prepend-icon="mdi-share-variant-outline" title="共享资源">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-select hide-details v-model="sharedResourcesForm.category" label="资源种类" :items="categorys"
                item-title="title" item-value="title"></v-select>
            </v-col>
            <v-col cols="12">
              <v-menu v-if="sharedResourcesForm.rids.length == 0">
                <template v-slot:activator="{ props }">
                  <v-btn color="primary" dark v-bind="props">选择资源</v-btn>
                </template>
                <v-list class="mt-2" width="180">
                  <v-list-item title="资料" prepend-icon="mdi-book-outline" link>
                    <SelectionCourseware @confirm="handleSelectionCoursewareConfirm"></SelectionCourseware>
                  </v-list-item>
                  <v-list-item title="仿真" prepend-icon="mdi-test-tube" link>
                    <SelectionSimulation @confirm="handleSelectionSimulationConfirm"></SelectionSimulation>
                  </v-list-item>
                  <v-list-item title="题目" prepend-icon="mdi-head-question-outline" link>
                    <SelectionQuestions @confirm="handleSelectionQuestionsConfirm"></SelectionQuestions>
                  </v-list-item>
                </v-list>
              </v-menu>
              <div v-else class="text-caption pl-4">
                * 已选
                <span>{{ sharedResourcesForm.rids.length }}</span>
                个
                <span>{{ typeLabel(sharedResourcesForm.type) }}</span>
                类型资源
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="取消" variant="plain" @click="closeSharedResources"></v-btn>
          <v-btn color="primary" text="确认" variant="tonal" @click="confirmSharedResources"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDeleteShareResource" max-width="500">
      <v-card rounded="lg" title="取消资源共享">
        <template #prepend>
          <v-avatar color="error" icon="mdi-alert-outline" variant="tonal" />
        </template>
        <template #text>
          <div class="mb-4 text-body-2 text-medium-emphasis">
            取消资源共享不会影响被其他用户引用的资源。
          </div>
        </template>
        <v-divider />
        <template #actions>
          <v-spacer />
          <v-btn border class="text-none" color="surface" text="取消" variant="flat"
            @click="dialogDeleteShareResource = false" />
          <v-btn class="text-none" color="error" text="确定" variant="flat" @click="delShareResource" />
        </template>
      </v-card>
    </v-dialog>
  </VCard>

</template>

<script setup>
import { FileApi } from '@/api/file';
import { ResourceShareApi } from '@/api/resource/resource-share';
import { FileFormat } from '@/utils/file-format';
import { notify } from '@kyvg/vue3-notification';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps({
  enableSelection: { type: Boolean, default: false }
})
const items = ref([])
const title = computed(() => props.enableSelection ? '选择共享资源' : '共享资源库')
const search = ref({
  self: false,
  name: '',
  type: null,
  category: [],
})
const options = ref({
  page: 1,
  itemsPerPage: 20
})
const totalItems = ref(0)
const categorys = ref([])
const types = ref([{ value: 'courseware', title: '资料' }, { value: 'questions', title: '题目' }, { value: 'simulation', title: '仿真' }])
const drawer = ref()
const drawerItem = ref({})
const sharedResourcesDialog = ref(false)
const sharedResourcesForm = ref({
  type: null,
  category: null,
  rids: []
})
const dialogDeleteShareResource = ref(false)

watch(() => [search.value.category, search.value.type, search.value.name, search.value.self], () => {
  reloadItems()
})


const handleSelectionCoursewareConfirm = (value) => {
  sharedResourcesForm.value.rids = value
  sharedResourcesForm.value.type = 'courseware'
}
const handleSelectionSimulationConfirm = (value) => {
  sharedResourcesForm.value.rids = value
  sharedResourcesForm.value.type = 'simulation'
}
const handleSelectionQuestionsConfirm = (value) => {
  sharedResourcesForm.value.rids = value
  sharedResourcesForm.value.type = 'questions'
}

const typeLabel = (key) => {
  switch (key) {
    case 'courseware': return '资料';
    case 'questions': return '题目';
    case 'simulation': return '仿真';
  }
  return '';
}

const viewItem = (value) => {
  drawerItem.value = value;
  drawer.value = true;
}

const delShareResource = async () => {
  await ResourceShareApi.del(drawerItem.value.id)
  dialogDeleteShareResource.value = false
  drawer.value = false
  reloadItems()
}

const closeSharedResources = () => {
  sharedResourcesDialog.value = false
  nextTick(() => {
    sharedResourcesForm.value.type = null
    sharedResourcesForm.value.category = null
    sharedResourcesForm.value.rids = []
  })
}

const confirmSharedResources = async () => {
  await ResourceShareApi.save({ rids: sharedResourcesForm.value.rids.join(','), type: sharedResourcesForm.value.type, category: sharedResourcesForm.value.category })
  closeSharedResources()
  reloadItems()
}

const joinTheRepository = async (item) => {
  const res = await ResourceShareApi.quoteResources(item.code)
  if (res) {
    notify({
      title: "已加入资源库",
      type: "info",
      data: {
        icon: "mdi-check-circle-outline",
      },
    });
  }
}

const reloadItems = () => {
  options.value.page = 1;
  options.value.itemsPerPage = 15;
  items.value = []
  loadItems({ side: 'end', done() { } })
}

const loadItems = async ({ side, done }) => {
  if (side === 'end') {
    const category = search.value.category.map(item => item.title).join(',')
    const res = await ResourceShareApi.page({ current: options.value.page, size: options.value.itemsPerPage, category, type: search.value.type, name: search.value.name, self: search.value.self })
    items.value.push(...res.records)
    options.value.page++;
    totalItems.value = res.total;
    if (res.records.length > 0) { done('ok') } else { done('empty') }
  }
}

const loadCategorys = async () => {
  const res = await ResourceShareApi.categoryList()
  categorys.value = res
}

onMounted(() => {
  loadCategorys()
})

</script>

<style scoped></style>
