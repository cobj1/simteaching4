<template>
  <VCard :elevation="enableSelection ? 0 : 1">
    <VToolbar title="报告模板管理" v-if="!enableSelection">
      <v-btn color="primary" dark @click="editItem()">
        新增模板
      </v-btn>
    </VToolbar>
    <v-data-iterator :items="items" :items-per-page="12" :search="search.name">
      <template v-slot:header>
        <div class="d-flex">
          <v-text-field v-model="search.name" hide-details class="pa-2" label="检索..." append-inner-icon="mdi-magnify"
            clearable></v-text-field>
        </div>
      </template>

      <template v-slot:default="{ items }">
        <v-container class="pa-2" fluid>
          <v-row dense>
            <v-col v-for="item in items" :key="item.title" cols="auto" sm="6" md="4" lg="3">
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-card v-bind="props" :color="selected == item.raw.id || isHovering ? 'surface-light' : undefined"
                    class="pb-3" border flat :class="{ 'cursor-pointer': enableSelection }"
                    :elevation="selected == item.raw.id || isHovering ? 4 : 0" @click="selected = item.raw.id">
                    <v-btn icon="mdi-delete" class="position-absolute" style="top: 10px; right: 10px; z-index: 1;"
                      v-if="!enableSelection" @click="deleteItem(item.raw)"></v-btn>

                    <v-img :aspect-ratio="1 / 1" :src="FileApi.filePath + item.raw.cover"></v-img>

                    <v-list-item :subtitle="item.raw.subtitle" class="mb-2">
                      <template v-slot:title>
                        <strong class="text-h6 mb-2">{{ item.raw.title }}</strong>
                      </template>
                    </v-list-item>

                    <div class="d-flex justify-space-between px-4">
                      <div class="d-flex align-center text-caption text-medium-emphasis me-1">
                        <v-icon icon="mdi-clock" start></v-icon>

                        <div class="text-truncate">{{ item.raw.createTime }}</div>
                      </div>

                      <v-btn class="text-none" size="small" text="查看" border flat @click="editItem(item.raw)">
                      </v-btn>
                    </div>
                  </v-card>
                </template>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn :disabled="page === 1" density="comfortable" icon="mdi-arrow-left" variant="tonal" rounded
            @click="prevPage"></v-btn>

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn :disabled="page >= pageCount" density="comfortable" icon="mdi-arrow-right" variant="tonal" rounded
            @click="nextPage"></v-btn>
        </div>
      </template>
    </v-data-iterator>
    <v-dialog v-model="dialog" max-width="1200px" :persistent="saving" :fullscreen="$vuetify.display.smAndDown"
      scrollable>
      <v-card :loading="saving">
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.title" label="标题"
                  :disabled="saving || enableSelection"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.describe" label="描述"
                  :disabled="saving || enableSelection"></v-text-field>
              </v-col>
              <v-col cols="12" class="report-template">
                <CkEditor v-model="editedItem.content"/>
              </v-col>
            </v-row>
          </v-container>
          <small class="text-caption text-medium-emphasis" v-show="saving">* 等待中请勿关闭窗口或刷新页面</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" :disabled="saving" @click="close">
            取消
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" :loading="saving" v-if="!enableSelection" @click="save">
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
  import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    ref
  } from 'vue';
  import html2canvas from 'html2canvas';
  import {
    useSettingsStore
  } from '@/stores/settings';
  import {
    FileApi
  } from '@/api/file';
  import {
    ResourceReportTemplateApi
  } from '@/api/resource/resource-report-template';

  const selected = defineModel()
  defineProps({
    enableSelection: {
      type: Boolean,
      default: false
    }
  })

  const settingsStore = useSettingsStore()

  const options = ref({
    page: 1,
    itemsPerPage: 5
  })

  const search = ref({
    name: '',
  })

  const items = ref([])
  const loading = ref(true)
  const saving = ref(false)
  const dialogDelete = ref(false)
  const dialog = ref(false)
  const editedIndex = ref(-1)
  const editedItem = ref({
    id: null,
    title: '',
    describe: '',
    content: '',
    cover: ''
  })
  const defaultItem = ref({
    id: null,
    title: '',
    describe: '',
    content: '',
    cover: ''
  })
  const formTitle = computed(() => editedIndex.value === -1 ? '新增模板' : '查看模板')

  const editItem = async (item) => {
    if (item) {
      editedIndex.value = items.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      const context = await FileApi.downloadTxt(item.content)
      editedItem.value.content = context
    } else {
      editedItem.value = Object.assign({}, defaultItem.value)
      editedIndex.value = -1;
    }
    dialog.value = true
  }

  const deleteItem = (item) => {
    editedIndex.value = items.value.indexOf(item);
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
    await ResourceReportTemplateApi.del(editedItem.value.id)
    loadItems(options.value)
    closeDelete()
  }

  const save = async () => {
    saving.value = true

    try {
      const elCkContent = document.querySelector('.ck-content')
      const canvas = await html2canvas(elCkContent, {
        backgroundColor: settingsStore.isDark ? '#000000' : '#ffffff',
        width: elCkContent.clientWidth,
        height: elCkContent.clientWidth,
      })
      canvas.toBlob(async (blob) => {

        const coverFile = new File([blob], editedItem.value.title + '.png', {
          type: 'image/png'
        })
        const coverConfig = await FileApi.upload(coverFile, 'simteaching/report-template/cover', true)
        editedItem.value.cover = coverConfig.url

        const contentBlob = new Blob([editedItem.value.content])
        const contentFile = new File([contentBlob], editedItem.value.title + '.txt', {
          type: 'text/plain'
        })
        const contentConfig = await FileApi.upload(contentFile, 'simteaching/report-template/content', true)
        editedItem.value.content = contentConfig.url

        await ResourceReportTemplateApi.save(editedItem.value)

        loadItems(options.value)
        close()
        saving.value = false
      }, 'image/png', 1.0)
    } catch (e) {
      saving.value = false
    }
  }

  const loadItems = async () => {
    loading.value = true
    items.value = await ResourceReportTemplateApi.list()
    loading.value = false
  }

  onMounted(() => {
    loadItems();
    window.addEventListener('resize', loadItems);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', loadItems);
  });
</script>

<style scoped>
  .report-template:deep(.ck-editor__editable_inline) {
    min-height: 300px;
    overflow-y: auto;
  }
</style>
