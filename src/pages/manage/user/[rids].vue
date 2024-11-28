<template>
  <VCard>
    <v-toolbar>
      <template #title v-if="!$vuetify.display.smAndDown">
        用户列表
      </template>
      <v-btn color="primary" dark @click="addItem()">
        新增项目
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-database-import" dark>
        批量导入
      </v-btn>
    </v-toolbar>
    <v-data-table-server v-model:options="options" :headers="headers" :items="serverItems" :items-length="totalItems"
      :loading="loading" item-value="name" :search="`${search.name},${search.role}`" @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-select v-if="roleItems.length > 1" hide-details v-model="search.role" class="pa-2" label="筛选角色..."
            :items="roleItems" item-title="name" item-value="id"></v-select>
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索用户名..."
            append-inner-icon="mdi-magnify"></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <VBtn icon="mdi-rename" variant="text" density="comfortable" size="small" @click="editItem(item)"></VBtn>
        <VBtn icon="mdi-lock-reset" variant="text" density="comfortable" size="small" @click="repwdItem(item)"></VBtn>
        <VBtn icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.account" label="账号" :disabled="!!editedItem.id"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.password" label="密码" :disabled="!!editedItem.id"
                  type="password"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.name" label="姓名"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.post" label="岗位"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn prepend-icon="mdi-bank" block class="mb-4" size="large" min-height="50">
                  <div v-if="editedItem.orgItem">{{ orgItemNames.at(-1) }} </div>
                  <div v-else> 选择组织</div>
                  <SelectionOrg @confirm="handleSelectionOrgConfirm"></SelectionOrg>
                  <v-tooltip v-if="editedItem.orgItem" activator="parent" location="top">
                    {{ orgItemNames.join(' / ') }}
                  </v-tooltip>
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.phone" label="手机"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.email" label="邮箱"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.avatar" label="头像(url)"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="取消" variant="plain" @click="close">
          </v-btn>
          <v-btn text="保存" color="primary" variant="tonal" @click="save">
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    <v-dialog v-model="dialogRepwd" max-width="600">
      <v-card prepend-icon="mdi-lock-reset" title="重置密码">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field v-model="editedItem.password" label="新密码"></v-text-field>
            </v-col>
          </v-row>
          <small class="text-caption text-medium-emphasis">*谨慎重置密码，将无法使用原密码登录。</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="取消" variant="plain" @click="closeRepwd"></v-btn>
          <v-btn color="primary" text="保存" variant="tonal" @click="repwdConfirm"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </VCard>
</template>

<script setup>
import { OrgApi } from '@/api/org';
import { RoleApi } from '@/api/role';
import { UserApi } from '@/api/user';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { VSpacer } from 'vuetify/components';

const route = useRoute()
const props = defineProps({
  rids: { type: [String, Number, Array] }
})
const search = reactive({ name: '', role: null })
const options = ref({ page: 1, itemsPerPage: 5 })
const headers = ref([
  {
    title: '姓名',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: '账号', key: 'account' },
  { title: '岗位', key: 'post', },
  { title: '手机号', key: 'phone', },
  { title: '邮箱', key: 'email', },
  { title: '组织', key: 'orgName', sortable: false, },
  { title: '最近登录时间', key: 'lastLoginTime', },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
])
const roleItems = ref([])
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialogDelete = ref(false)
const dialog = ref(false)
const dialogRepwd = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  account: '',
  password: '',
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
  password: '',
  name: '',
  phone: '',
  email: '',
  post: '',
  org: null,
  avatar: '',
  role: null,
  orgItem: null
})
const formTitle = computed(() => editedIndex.value === -1 ? '新增项目' : '编辑项目')
const orgItemNames = computed(() => {
  const orgNames = (org) => {
    if (org.parent) return [org.name, ...orgNames(org.parent)]
    else return [org.name]
  }
  if (editedItem.value.orgItem) {
    return orgNames(editedItem.value.orgItem).reverse()
  }
  return null;
})

watch(() => [props.rids, route.params.rids], () => {
  options.value.page = 1
  loadRoles()
})

const handleSelectionOrgConfirm = async (value) => {
  editedItem.value.org = value.join(',')
  editedItem.value.orgItem = await OrgApi.selectOneAndParentById(editedItem.value.org)
}

const addItem = () => {
  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1;
  dialog.value = true
}

const editItem = async (item) => {
  editedIndex.value = serverItems.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  editedItem.value.orgItem = await OrgApi.selectOneAndParentById(item.org)
  dialog.value = true
}

const deleteItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true;
}

const repwdItem = (item) => {
  editedIndex.value = serverItems.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogRepwd.value = true;
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

const closeRepwd = () => {
  dialogRepwd.value = false;
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

const repwdConfirm = async () => {
  await UserApi.repwd(editedItem.value.id, editedItem.value.password)
  loadItems(options.value)
  closeRepwd()
}


const save = async () => {
  editedItem.value.role = search.role
  editedItem.value.orgItem = null
  await UserApi.save(editedItem.value)
  loadItems(options.value)
  close()
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
  loading.value = true
  if (search.role) {
    const res = await UserApi.page({
      current: page,
      size: itemsPerPage,
      sortKey: sortBy[0] ? sortBy[0].key : null,
      sortOrder: sortBy[0] ? sortBy[0].order : '',
      name: search.name,
      role: search.role
    })
    serverItems.value = res.records
    totalItems.value = res.total
  }
  loading.value = false
}

const loadRoles = async () => {
  roleItems.value = await RoleApi.list(route.params.rids || props.rids)
  if (roleItems.value.length > 0)
    search.role = roleItems.value[0].id
}

onMounted(() => {
  loadRoles()
})

</script>


<style scoped></style>
