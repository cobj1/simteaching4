<template>
  <VCard :elevation="enableSelection ? 0 : 1">
    <VToolbar title="作业列表" v-if="!enableSelection">
      <v-btn color="primary" dark @click="editItem()">
        新增作业
      </v-btn>
    </VToolbar>
    <v-data-table-server v-model:options="options" v-model="selected" item-value="id" :show-select="enableSelection"
      :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading" :search="`${search.title}`"
      :mobile="$vuetify.display.smAndDown" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-text-field v-model="search.title" hide-details class="pa-2" label="检索..." append-inner-icon="mdi-magnify"
            clearable></v-text-field>
        </div>
      </template>
      <template v-slot:item.cover="{ item }">
        <v-img :src="useFileUri(item.cover)" :width="80" :height="45" cover>
          <template v-slot:placeholder>
            <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
          </template>
          <template v-slot:error>
            <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
          </template>
        </v-img>
      </template>
      <template v-slot:item.startTime="{ item }">
        {{ useDateFormat(item.startTime, "YYYY-MM-DD") }} - {{ useDateFormat(item.endTime, "YYYY-MM-DD") }}
      </template>
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
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.title" label="标题" :disabled="loadingEdit"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-hover v-if="editedItem.cover" v-slot="{ isHovering, props }">
                  <v-card v-bind="props" color="surface-light" height="300px">
                    <v-img :src="useFileUri(editedItem.cover)" height="300px"></v-img>
                    <v-btn icon="mdi-close" class="opacity-0 position-absolute" :class="{ 'opacity-100': isHovering }"
                      style="left: 50%; top: 50%; transform: translate(-50%,-50%);" :disabled="loadingEdit"
                      @click="editedItem.cover = null; coverFile = null"></v-btn>
                  </v-card>
                </v-hover>
                <v-file-upload v-else v-model="coverFile" :disabled="loadingEdit" density="comfortable" title="封面"
                  height="300px" accept=".png,.jpg" @update:model-value="handleCoverFileUpdate"></v-file-upload>
              </v-col>
              <v-col cols="12">
                <v-select v-model="editedItem.courseId" hide-details class="pa-2" label="选择课程"
                  :items="courseStore.courses" item-title="name" item-value="id" clearable></v-select>
              </v-col>
              <v-col cols="12">
                <v-file-input v-model="editedItem.file" label="选择文件..." :disabled="loadingEdit">
                  <template #details v-if="editedItem.url">
                    <small class="text-caption text-medium-emphasis" style="word-break:break-all;">
                      {{ FileApi.filePath + editedItem.url }}</small>
                  </template>
                </v-file-input>
              </v-col>
              <v-col v-if="editedItem.url" cols="12">
                <v-responsive v-if="resourceItem">
                  <ResourceViewResource v-model="resourceItem" :completed="completed">
                  </ResourceViewResource>
                </v-responsive>
              </v-col>
              <v-col cols="12">
                <v-date-input v-model="editedItem.time" label="开放时间" multiple="range"></v-date-input>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="editedItem.remarks" label="描述" :disabled="loadingEdit"></v-textarea>
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
        <v-card-title class="text-h5">您确定要删除此仿真资源吗？</v-card-title>
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
    VDateInput
  } from 'vuetify/labs/VDateInput'
  import {
    computed,
    nextTick,
    ref
  } from 'vue';
  import {
    FileApi
  } from '@/api/file';
  import {
    VFileUpload
  } from 'vuetify/labs/VFileUpload'
  import {
    HomeworkApi
  } from '@/api/homework/homework';
  import {
    VImg
  } from 'vuetify/components';
  import {
    useDateFormat,
    useNow
  } from '@vueuse/core';
  import {
    useResourceStore
  } from '@/stores/resource';
  import {
    useCourseStore
  } from '@/stores/course';
  import {
    useFileUri
  } from '@/utils/simulation-uri';
  import {
    useObjectUrl
  } from '@vueuse/core';
  import {
    fileTypeFromBlob
  } from 'file-type';
  import {
    TimeRangeGenerators
  } from '@/utils/time-range-generators';

  const courseStore = useCourseStore()
  const selected = defineModel()
  defineProps({
    enableSelection: {
      type: Boolean,
      default: false
    }
  })
  const options = ref({
    page: 1,
    itemsPerPage: 5
  })
  const headers = ref([{
      title: '封面',
      key: 'cover',
      sortable: false,
    },
    {
      title: '标题',
      key: 'title',
      sortable: false,
    },
    {
      title: '课程',
      key: 'courseName',
      sortable: false,
    },
    {
      title: '开放时间',
      key: 'startTime'
    },
    {
      title: '描述',
      key: 'remarks'
    },
    {
      title: 'Actions',
      key: 'actions',
      sortable: false,
      align: 'end'
    },
  ])
  const search = ref({
    title: '',
    date: []
  })
  const serverItems = ref([])
  const resourceItem = ref(null)
  const loading = ref(true)
  const loadingEdit = ref(false)
  const totalItems = ref(0)
  const dialogDelete = ref(false)
  const dialog = ref(false)
  const editedIndex = ref(-1)
  const coverFile = defineModel('coverFile')
  const SupportExts = ['jpg', 'png', 'xml', 'txt', 'mp4', 'mp3', 'docx', 'xlsx', 'pdf']

  const editedItem = ref({
    id: null,
    cover: '',
    title: '',
    courseId: null,
    time: [],
    remarks: '',
    url: null,
    urlOld: null,
    size: null,
    file: null
  })
  const defaultItem = ref({
    id: null,
    cover: '',
    title: '',
    courseId: null,
    time: [],
    remarks: '',
    url: null,
    urlOld: null,
    size: null,
    file: null
  })
  const resource = ref({
    ext: null,
    url: '',
    text: ''
  })
  const formTitle = computed(() => editedIndex.value === -1 ? '新增作业' : '编辑作业')
  const completed = computed(() => editedItem.value.id != null)

  const editItem = async (item) => {
    if (item) {
      editedIndex.value = serverItems.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      editedItem.value.time = TimeRangeGenerators(item.startTime, item.endTime)
      resource.value.url = FileApi.filePath + editedItem.value.url
      //支持在线预览的资源
      if (SupportExts.includes(resource.value.url.substring(resource.value.url.lastIndexOf('.') + 1))) {
        const fileRes = await fetch(resource.value.url)
        const blob = await fileRes.blob()
        if (blob.type == 'text/plain') {
          resource.value.ext = 'txt'
        } else {
          const fileType = await fileTypeFromBlob(blob)
          resource.value.ext = fileType.ext
        }
        resource.url = URL.createObjectURL(blob)
        if (['xml', 'txt'].includes(resource.ext)) {
          const reader = new FileReader()
          reader.readAsText(blob)
          reader.onload = () => {
            resource.value.text = reader.result
            resourceItem.value = resource
          }
        } else resourceItem.value = resource
      } else resourceItem.value = resource
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
    await HomeworkApi.del(editedItem.value.id)
    loadItems(options.value)
    closeDelete()
  }

  const save = async () => {
    loadingEdit.value = true
    try {
      if (editedItem.value.file) {
        const res = await FileApi.upload(editedItem.value.file, 'simteaching/homework')
        editedItem.value.url = res.url
        editedItem.value.size = res.size
        if (editedItem.value.urlOld) FileApi.delete(editedItem.value.urlOld)
      }
      if (coverFile.value) {
        const coverConfig = await FileApi.upload(coverFile.value, 'simteaching/homework/cover', true)
        editedItem.value.cover = coverConfig.url
      }
      await HomeworkApi.save({
        ...editedItem.value,
        startTime: editedItem.value.time[0],
        endTime: editedItem.value.time.at(-1)
      })
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
    try {
      loading.value = true
      await courseStore.loadCourses()
      const res = await HomeworkApi.page({
        current: page,
        size: itemsPerPage,
        sortKey: sortBy[0] ? sortBy[0].key : null,
        sortOrder: sortBy[0] ? sortBy[0].order : null,
        title: search.value.title,
      })
      serverItems.value = res.records.map(item => {
        return {
          ...item,
          courseName: item.courseId ? courseStore.courses.find(course => course.id == item.courseId)
            ?.name : "",
        }
      })
      totalItems.value = res.total
    } catch (e) {
      /* empty */
    }
    loading.value = false
  }
  const handleCoverFileUpdate = (file) => {
    editedItem.value.cover = useObjectUrl(file).value
  }
</script>

<style scoped></style>
