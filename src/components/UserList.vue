<template>
  <VCard>
    <v-toolbar>
      <template #title v-if="!$vuetify.display.smAndDown">
        用户列表
      </template>
      <v-text-field v-model="search.name" class="ml-2" density="compact" placeholder="检索用户名..." max-width="300px"
        hide-details @change="loadItems(options)"></v-text-field>
      <v-btn class="mb-2" color="primary" dark @click="addItem()">
        新增项目
      </v-btn>
      <v-btn class="mb-2" color="primary" prepend-icon="mdi-database-import" dark>
        批量导入
      </v-btn>
    </v-toolbar>
    <v-data-table-server v-model:options="options" :headers="headers" :items="serverItems" :items-length="totalItems"
      :loading="loading" item-value="name" @update:options="loadItems">
      <template v-slot:item.actions="{ item }">
        <VBtn icon="mdi-pencil" variant="text" density="comfortable" size="small" @click="editItem(item)"></VBtn>
        <VBtn icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.title" label="标题"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="editedItem.type" label="类型" :items="NoticeApi.noticeType"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.cover" label="封面(url)"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.content" label="内容"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">
            取消
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
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
import { NoticeApi } from '@/api/notice'
import { UserApi } from '@/api/user';
import { computed, nextTick, reactive, ref } from 'vue';

const props = defineProps({
  role: {
    type: String,
    default: '99'
  },
})

const search = reactive({
  name: ''
})
const options = ref({
  page: 1,
  itemsPerPage: 5
})
const headers = ref([
  {
    title: '姓名',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: '账号', key: 'account' },
  { title: '岗位', key: 'phone', },
  { title: '手机号', key: 'phone', },
  { title: '邮箱', key: 'email', },
  { title: '组织', key: 'orgName', sortable: false, },
  { title: '最近登录时间', key: 'lastLoginTime', },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  title: '',
  type: null,
  cover: '',
  content: '',
})
const defaultItem = ref({
  id: null,
  title: '',
  type: null,
  cover: '',
  content: '',
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增项目' : '编辑项目')

const addItem = () => {
  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1;
  dialog.value = true
}

const editItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
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
  await UserApi.del(editedItem.value.id)
  loadItems(options.value)
  closeDelete()
}


const save = async () => {
  await NoticeApi.save(editedItem.value)
  loadItems(options.value)
  close()
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const res = await UserApi.page({ current: page, size: itemsPerPage, sortKey: sortBy[0] ? sortBy[0].key : null, sortOrder: sortBy[0] ? sortBy[0].order : '', name: search.name, role: props.role })
  serverItems.value = res.records
  totalItems.value = res.total
  loading.value = false
}

</script>


<style scoped></style>
