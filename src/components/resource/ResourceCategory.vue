<template>
  <div @click="dialog = true">
    <slot></slot>
  </div>
  <v-dialog v-model="dialog" width="auto" scrollable min-width="500px">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-format-list-bulleted-type">
        <template #title>
          <div class="d-flex align-center justify-space-between">
            类型管理
            <v-btn prepend-icon="mdi-plus" variant="text" @click="editItem(null)">新增类型</v-btn>
          </div>
        </template>
        <v-divider class="mt-3"></v-divider>
        <v-card-text class="px-4" style="height: 400px;">
          <v-list>
            <v-list-item v-for="item in items" :key="item.id" :title="item.name">
              <template #append>
                <v-btn prepend-icon="mdi-pencil" size="small" @click="editItem(item)">修改</v-btn>
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
    <v-card prepend-icon="mdi-format-list-bulleted-type" :title="formTitle">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field label="类型名称" required v-model="editedItem.name"></v-text-field>
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
import { ResourceApi, ResourceCategory } from '@/api/resource';
import { nextTick, onMounted, ref } from 'vue';

const dialog = ref(false)
const dialogEdit = ref(false)
const dialogDelete = ref(false)
const items = ref<ResourceCategory[]>([])
const editedIndex = ref(-1)
const editedItem = ref<ResourceCategory>({
  id: '',
  name: ''
})
const defaultItem = ref<ResourceCategory>({
  id: '',
  name: ''
})
const formTitle = ref('')

const editItem = (item: ResourceCategory | null) => {
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

const deleteItem = (item: ResourceCategory) => {
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
  await ResourceApi.categorySave(editedItem.value)
  loadItems()
  close()
}

const deleteItemConfirm = async () => {
  await ResourceApi.categoryDel(editedItem.value.id)
  loadItems()
  closeDelete()
}

const loadItems = async () => {
  items.value = await ResourceApi.categorySelectAll() as any
}

onMounted(() => loadItems())
</script>

<style scoped></style>
