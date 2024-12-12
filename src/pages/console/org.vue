<template>
  <v-card>
    <v-toolbar :title="title">
      <v-btn prepend-icon="mdi-bank-plus" @click="newItem(defaultItem)">新增根节点</v-btn>
    </v-toolbar>
    <v-row class="pa-4" justify="space-between">
      <v-col cols="12">
        <v-treeview v-model:activated="selected" :items="serverItems" item-value="id" :load-children="fetchOrgs"
          color="primary" density="compact" :activatable="enableSelection" :open-on-click="!enableSelection" transition>
          <template #title="{ item }">
            {{ item.name }} {{ item.childrenCount > 0 ? ` ( ${item.childrenCount} ) ` : `` }}
          </template>
          <template #append="{ item }">
            <v-btn variant="text" min-width="30px" class="pa-2" @click.stop="newItem(item)">
              <v-icon icon="mdi-subdirectory-arrow-right"></v-icon>
              <span class="ml-1" v-show="!$vuetify.display.smAndDown">添加子组织</span>
            </v-btn>
            <v-btn variant="text" min-width="30px" class="pa-2" @click.stop="updateNameItem(item)">
              <v-icon icon="mdi-rename"></v-icon>
              <span class="ml-1" v-show="!$vuetify.display.smAndDown">重命名</span>
            </v-btn>
            <v-btn variant="text" min-width="30px" class="pa-2" @click.stop="deleteItem(item)">
              <v-icon icon="mdi-delete"></v-icon>
              <span class="ml-1" v-show="!$vuetify.display.smAndDown">删除</span>
            </v-btn>
          </template>
        </v-treeview>
      </v-col>
    </v-row>
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
    <v-dialog v-model="dialogUpdateName" max-width="500">
      <v-card prepend-icon="mdi-pencil" title="修改项目名称">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="editedItem.name" label="项目名称" required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="取消" variant="plain" @click="closeUpdateName"></v-btn>
          <v-btn color="primary" text="保存" variant="tonal" @click="updateNameItemConfirm"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogNew" max-width="500">
      <v-card prepend-icon="mdi-pencil" title="新增项目">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="editedItem.name" label="项目名称" required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="取消" variant="plain" @click="closeNew"></v-btn>
          <v-btn color="primary" text="保存" variant="tonal" @click="newItemConfirm"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>
<script setup>
import { OrgApi } from '@/api/user/org';
import { computed, nextTick, onMounted, ref } from 'vue';
import { VTreeview } from 'vuetify/labs/VTreeview'

const selected = defineModel()
const props = defineProps({
  enableSelection: { type: Boolean, default: false }
})
const title = computed(() => props.enableSelection ? '选择组织' : '组织')
const serverItems = ref([])
const dialogDelete = ref(false)
const dialogUpdateName = ref(false)
const dialogNew = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  parentId: null,
  name: '',
  admin: '',
  parent: null
})
const defaultItem = ref({
  id: null,
  parentId: null,
  name: '',
  admin: '',
  parent: null
})

const deleteItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true;
}
const updateNameItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogUpdateName.value = true;
}
const newItem = (item) => {
  editedIndex.value = -1;
  editedItem.value = Object.assign({}, defaultItem.value)
  editedItem.value.parentId = item.id
  editedItem.value.parent = item
  dialogNew.value = true;
}
const closeDelete = () => {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  })
}
const closeUpdateName = () => {
  dialogUpdateName.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  })
}
const closeNew = () => {
  dialogNew.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  })
}
const deleteItemConfirm = async () => {
  try {
    await OrgApi.del(editedItem.value.id)
    if (editedItem.value.parent) {
      fetchOrgs(editedItem.value.parent)
    } else
      load()
  } catch (e) { /* empty */ }
  closeDelete()
}
const updateNameItemConfirm = async () => {
  await OrgApi.save({ id: editedItem.value.id, parentId: editedItem.value.parentId, name: editedItem.value.name })
  if (editedItem.value.parent) {
    fetchOrgs(editedItem.value.parent)
  } else
    load()
  closeUpdateName()
}
const newItemConfirm = async () => {
  await OrgApi.save({ id: editedItem.value.id, parentId: editedItem.value.parentId, name: editedItem.value.name })
  if (editedItem.value.parent.id) {
    fetchOrgs(editedItem.value.parent)
  } else
    load()
  closeNew()
}

const fetchOrgs = async (item) => {
  const res = await OrgApi.selectByParent(item.id, true)
  item.childrenCount = res.length
  if (res.length > 0) {
    return item.children = res.map(child => {
      child.parent = item
      return wrap(child)
    })
  } else
    return item.children = null
}

const wrap = (item) => {
  return { ...item, children: (item.childrenCount > 0 ? [] : null) }
}

const load = async () => {
  const res = await OrgApi.selectByAdmin(true)
  serverItems.value = res.map(item => wrap(item))
}

onMounted(() => {
  load()
})

</script>
<script>


</script>
