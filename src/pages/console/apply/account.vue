<template>
  <VCard>
    <VToolbar title="试用账号">
    </VToolbar>
    <v-data-table-server v-model:options="options" :items-per-page="options.itemsPerPage" :headers="headers"
      :items="serverItems" :items-length="totalItems" :loading="loading" :search="`${search.name}`" item-value="name"
      :mobile="$vuetify.display.smAndDown" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex flex-wrap">
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索..."
            append-inner-icon="mdi-magnify"></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn prepend-icon="mdi-clock-edit-outline" variant="text" density="comfortable" size="small"
          @click="overtimeItem(item)">延长时间</VBtn>
        <VBtn prepend-icon="mdi-account-switch-outline" variant="text" density="comfortable" size="small">注册正式用户</VBtn>
        <VBtn prepend-icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)">删除
        </VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">您确定要删除此项目吗？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDelete">取消</v-btn>
          <v-btn variant="text" @click="deleteItemConfirm">确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogOvertime" max-width="500">
      <v-card rounded="lg" title="延长试用时间">
        <template #prepend>
          <v-avatar color="warning" icon="mdi-alert-outline" variant="tonal" />
        </template>
        <template #text>
          <div class="mb-4 text-body-2 text-medium-emphasis">
            为了保障个人信息安全和避免法律风险，请勿通过非法手段延长软件试用期。
          </div>
          <v-text-field color="error" density="compact" placeholder="Type deactivate" />
        </template>
        <v-divider />
        <template #actions>
          <v-spacer />
          <v-btn border class="text-none" color="surface" text="取消" variant="flat"
            @click="dialogOvertime = false" />
          <v-btn class="text-none" color="warning" text="延长" variant="flat" @click="dialogOvertime = false" />
        </template>
      </v-card>
    </v-dialog>
  </VCard>
</template>

<script setup>
import { UserApi } from '@/api/user/user';
import { nextTick, ref } from 'vue';

const options = ref({
  page: 1,
  itemsPerPage: 10
})
const headers = ref([
  {
    title: '姓名',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: '账号', key: 'account' },
  { etitle: '岗位', key: 'post', },
  { title: '手机号', key: 'phone', },
  { title: '邮箱', key: 'email', },
  { title: '组织', key: 'orgName', sortable: false, },
  { title: '最近登录时间', key: 'lastLoginTime', },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const search = ref({
  name: '',
})
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialogOvertime = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  account: '',
  name: '',
  phone: '',
  email: '',
  post: '',
  org: null,
  avatar: '',
  role: null,
  orgItem: null
})
const defaultItem = ref({
  id: null,
  account: '',
  name: '',
  phone: '',
  email: '',
  post: '',
  org: null,
  avatar: '',
  role: null,
  orgItem: null
})

const deleteItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true;
}

const overtimeItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogOvertime.value = true;
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

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  const res = await UserApi.trialPage({
    current: page,
    size: itemsPerPage,
    sortKey: sortBy[0] ? sortBy[0].key : null,
    sortOrder: sortBy[0] ? sortBy[0].order : null,
    name: search.value.name,
  })
  serverItems.value = res.records.map(item => {
    return {
      ...item,
    }
  })
  totalItems.value = res.total
  loading.value = false
}
</script>

<style scoped></style>
