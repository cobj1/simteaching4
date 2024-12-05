<template>
  <VCard>
    <VToolbar :title="title"> </VToolbar>
    <div class="d-flex">
      <v-select hide-details v-model="search.category" class="pa-2" label="筛选类型..." :items="categorys"
        item-title="title" item-value="title"></v-select>
      <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..."
        append-inner-icon="mdi-magnify"></v-text-field>
    </div>

    <v-layout>
      <v-navigation-drawer v-model="drawer" temporary location="right" width="360">
        <v-img height="200" width="100%"
          src="https://lh5.googleusercontent.com/YDbm0zyiNgt4m34LZduCVk1pVshGxnllcNzvjeWBnjHYc3jaaOudLYI2iQNPHuS1-yQfcqpWA98=w90-h90-p"></v-img>
        <VDivider></VDivider>
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-file-outline" title="jess-harding-lqT6NAmTaiY-unsplash.jpg"></v-list-item>
          <v-list-item prepend-icon="mdi-calendar-range" subtitle="共享时间: 2024-12-05 10:28:52"></v-list-item>
          <v-list-item prepend-icon="mdi-format-list-bulleted-type" subtitle="文件类型: 课件资源"></v-list-item>
          <v-list-item prepend-icon="mdi-account-outline" subtitle="分享人: 老师"></v-list-item>
          <v-list-item prepend-icon="mdi-bank" subtitle="组织: 清华"></v-list-item>
        </v-list>
        <v-btn color="primary" class="d-flex mx-auto" prepend-icon="mdi-plus">加入资源库</v-btn>
      </v-navigation-drawer>
      <v-main height="calc(100vh - 240px)">
        <v-infinite-scroll height="calc(100vh - 280px)" @load="loadItems">
          <v-sheet class="d-flex flex-wrap pa-4 ga-4 justify-center">
            <v-sheet v-for="(item) in items" :key="item.id">
              <v-card width="300" hover @click.stop="drawer = !drawer">
                <FileIcon :file="item.rname"></FileIcon>
                <v-card-title>
                  {{ item.rname }}
                </v-card-title>
                <v-card-subtitle>
                  {{ item.creatorName }} | {{ item.orgName }}
                </v-card-subtitle>
                <v-card-actions class="px-4">
                  <v-icon icon="mdi-file-plus" size="small"></v-icon>
                  <div class="text-caption">0</div>
                  <v-spacer></v-spacer>
                  <v-btn color="medium-emphasis" prepend-icon="mdi-plus" size="small" @click.stop>加入资源库</v-btn>
                </v-card-actions>
                <v-chip class="position-absolute top-0 rounded-bs-0	" label>
                  <v-icon icon="mdi-label" start></v-icon>
                  <span v-if="item.type == 'courseware'">资料</span>
                  <span v-if="item.type == 'questions'">题目</span>
                  <span v-if="item.type == 'simulation'">仿真</span>
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
  </VCard>

</template>

<script setup>
import { ResourceShareApi } from '@/api/resource/resource-share';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps({
  enableSelection: { type: Boolean, default: false }
})
const items = ref([])
const title = computed(() => props.enableSelection ? '选择共享资源' : '共享资源库')
const search = ref({
  name: '',
  category: null,
})
const options = ref({
  page: 1,
  itemsPerPage: 20
})
const totalItems = ref(0)
const categorys = ref([])
const drawer = ref()

watch(() => [search.value.category, search.value.name], () => {
  options.value.page = 1;
  options.value.itemsPerPage = 15;
  items.value = []
  loadItems({ side: 'end', done() { } })
})

const loadItems = async ({ side, done }) => {
  if (side === 'end') {
    const res = await ResourceShareApi.page({ current: options.value.page, size: options.value.itemsPerPage, category: search.value.category, name: search.value.name })
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
