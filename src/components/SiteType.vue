<template>
  <div @click="dialog = true">
    <slot></slot>
  </div>
  <v-dialog v-model="dialog" width="auto" scrollable min-width="400px">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-format-list-bulleted-type">
        <template #title>
          <div class="d-flex align-center justify-space-between">
            类型管理
            <v-btn prepend-icon="mdi-plus" @click="editItem(null)">新增类型</v-btn>
          </div>
        </template>
        <v-divider class="mt-3"></v-divider>
        <v-card-text class="px-4" style="height: 400px;">
          <v-list>
            <v-list-item v-for="item in items" :key="item.id" :title="item.type">
              <template #append>
                <v-btn prepend-icon="mdi-delete" size="small" @click="deleteItem(item)">删除</v-btn>
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
  <v-dialog v-model="dialogEdit" max-width="600">
    <v-card prepend-icon="mdi-format-list-bulleted-type" :title="formTitle">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field label="类型名称" required v-model="editedItem.type"></v-text-field>
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
import { Site, SiteApi } from '@/api/site';
import { nextTick, onMounted, ref } from 'vue';

const dialog = ref(false)
const dialogEdit = ref(false)
const dialogDelete = ref(false)
const items = ref<Site[]>([])
const editedIndex = ref(-1)
const editedItem = ref<Site>({
  id: '',
  type: ''
})
const defaultItem = ref<Site>({
  id: '',
  type: ''
})
const formTitle = ref('')

const editItem = (item: Site | null) => {
  if (item) {
    editedIndex.value = items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    formTitle.value = '修改类型'
  } else {
    editedIndex.value = -1;
    editedItem.value = Object.assign({}, defaultItem.value)
    formTitle.value = '新增类型'
  }
  dialogEdit.value = true;
}

const deleteItem = (item: Site) => {
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
  await SiteApi.typeSave(editedItem.value)
  loadItems()
  close()
}

const deleteItemConfirm = async () => {
  await SiteApi.typeDel(editedItem.value.id)
  loadItems()
  closeDelete()
}

const loadItems = async () => {
  items.value = await SiteApi.typeSelectAll() as any
}

onMounted(() => loadItems())
</script>

<style scoped></style>
