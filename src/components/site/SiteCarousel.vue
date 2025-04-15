<template>
  <div @click="dialog = true">
    <slot></slot>
  </div>
  <v-dialog v-model="dialog" width="auto" scrollable max-width="600px" min-width="400px">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-panorama-variant-outline">
        <template #title>
          <div class="d-flex align-center justify-space-between">
            轮播图管理
            <v-btn prepend-icon="mdi-plus" variant="text" @click="addItem()">新增轮播图</v-btn>
          </div>
        </template>
        <v-divider class="mt-3"></v-divider>
        <v-card-text class="px-4" style="height: 400px;">
          <v-list>
            <v-list-item v-for="item in items" :key="item.id" :title="item.title">
              <template #prepend>
                <v-img :src="useFileUri(item.url)" width="80" height="45" class="mr-4"></v-img>
              </template>
              <template #title>
                {{ item.title }}
              </template>
              <template #subtitle>
                <div style="word-break: break-all;">
                  链接: {{ item.url }}
                </div>
              </template>
              <template #append>
                <v-btn prepend-icon="mdi-pencil" size="small" class="ml-2" @click="editItem(item)">修改</v-btn>
                <v-btn prepend-icon="mdi-delete" size="small" class="ml-2" @click="deleteItem(item)">删除</v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="关闭" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-dialog v-model="dialogEdit" max-width="500">
    <v-card prepend-icon="mdi-image-outline" :title="formTitle">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field label="标题" required v-model="editedItem.title"></v-text-field>
          </v-col>
          <v-col cols="12" style="display: flex; justify-content: center;">
            <v-hover v-if="editedItem.url" height="140px" v-slot="{ isHovering, props}">
              <v-card v-bind="props" color="surface-light" height="140px" width="140px">
                <v-img :src="useFileUri(editedItem.url)" height="140px" width="140px"></v-img>
                <v-btn icon="mdi-close" class="opacity-0 position-absolute" :class="{ 'opacity-100': isHovering }"
                  style="left: 50%; top: 50%; transform: translate(-50%,-50%);"
                  @click="editedItem.url = ''; imageFile = null"></v-btn>
              </v-card>
            </v-hover>
            <v-file-upload v-else :height="140" :width="140"  v-model="imageFile" density="comfortable" title="轮播图"
                accept=".png,.jpg" @update:model-value="handleCoverFileUpdate">
              </v-file-upload>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="取消" variant="plain" @click="close"></v-btn>
        <v-btn color="primary" text="确定" variant="tonal" @click="saveItemConfirm"></v-btn>
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
</template>

<script setup lang="ts">
import { SiteCarousel, SiteApi } from '@/api/site';
import { nextTick, onMounted, ref } from 'vue';
import { useFileUri } from '@/utils/simulation-uri';
import { FileApi } from '@/api/file';
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { useObjectUrl } from '@vueuse/core';

const props = defineProps({
  rids: { type: [String, Number, Array] },
  enableSelection: { type: Boolean, default: false }

})
const dialog = ref(false)
const dialogEdit = ref(false)
const dialogDelete = ref(false)
const imageFile = ref(null)
const items = ref<SiteCarousel[]>([])
const editedIndex = ref(-1)
const editedItem = ref<SiteCarousel>({
  id: '',
  title: '',
  url: '',
})
const defaultItem = ref<SiteCarousel>({
  id: '',
  title: '',
  url: '',
})
const formTitle = ref('')

const addItem = () => {  
    editedIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value)
    formTitle.value = '新增类型'  
  dialogEdit.value = true;
}
const editItem = (item: SiteCarousel | null) => {
  if (item) {
    editedIndex.value = items.value.indexOf(item)
    editedItem.value.url=useFileUri(item.url)
    editedItem.value = Object.assign({}, item)
    formTitle.value = '修改类型'
  } else {
    editedIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value)
    formTitle.value = '新增类型'
  }
  dialogEdit.value = true;
}

const deleteItem = (item: SiteCarousel) => {
  editedIndex.value = items.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true
}

const close = () => {
  dialogEdit.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1
  })
}

const closeDelete = () => {
  dialogDelete.value = false
  nextTick(() => {
    editedIndex.value = -1
    editedItem.value = Object.assign({}, defaultItem.value)
  })
}

const saveItemConfirm = async () => {
  await SiteApi.carouselSave(editedItem.value)
  loadItems()
  close()
}

const deleteItemConfirm = async () => {
  await SiteApi.carouselDel(editedItem.value.id)
  loadItems()
  closeDelete()
}
const handleCoverFileUpdate = (file) => {
  editedItem.value.url = useObjectUrl(file).value
}
const loadItems = async () => {
  items.value = await SiteApi.carouselList() as any
}

onMounted(() => loadItems())
</script>

<style scoped></style>
