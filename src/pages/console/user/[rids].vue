<template>
  <VCard :elevation="enableSelection ? 0 : 1">
    <v-toolbar title="用户管理" v-if="!enableSelection">
      <v-btn color="primary" dark @click="addItem()">
        添加用户
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-database-import" dark>
        批量导入
        <batch-users @change="handleBatchUsersChange"></batch-users>
      </v-btn>
    </v-toolbar>
    <v-data-table-server v-model:options="options" v-model="selected" item-value="id" :show-select="enableSelection"
      :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading"
      :search="`${search.name},${search.role},${search.org}`" :mobile="$vuetify.display.smAndDown"
      @update:options="loadItems">
      <template v-slot:top>
        <div class="d-flex">
          <v-btn prepend-icon="mdi-bank" class="ma-2 flex-1-1" size="large" min-height="56">
            <div v-if="search.orgItem">{{ searchOrgItemNames.at(-1) }} </div>
            <div v-else> 筛选组织</div>
            <SelectionOrg @confirm="handleSearchSelectionOrgConfirm"></SelectionOrg>
            <v-tooltip v-if="search.orgItem" activator="parent" location="top">
              {{ searchOrgItemNames.join(' / ') }}
            </v-tooltip>
          </v-btn>
          <v-select v-if="roleItems.length > 1" hide-details v-model="search.role" class="pa-2" label="筛选角色..."
            :items="roleItems" item-title="name" item-value="id" clearable></v-select>
          <v-text-field hide-details v-model="search.name" class="pa-2" label="检索用户名..." append-inner-icon="mdi-magnify"
            clearable></v-text-field>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.avatar="{ item }">
        <img :src="useFileUri(item.avatar)" alt="头像" style="width: 40px; height: 40px; border-radius: 50%;">
      </template>
      <template v-slot:item.actions="{ item }" v-if="!enableSelection">
        <VBtn icon="mdi-rename" variant="text" density="comfortable" size="small" @click="editItem(item)"></VBtn>
        <VBtn icon="mdi-lock-reset" variant="text" density="comfortable" size="small" @click="repwdItem(item)"></VBtn>
        <VBtn icon="mdi-delete" variant="text" density="comfortable" size="small" @click="deleteItem(item)"></VBtn>
      </template>
    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="600px" :fullscreen="$vuetify.display.smAndDown" scrollable>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="12">
                <v-text-field v-model="editedItem.avatar" label="头像(url)"></v-text-field>
              </v-col> -->
              <v-col cols="12" style="display: flex; justify-content: center;">
                <v-hover v-if="editedItem.avatar" height="60px" v-slot="{ isHovering, props }">
                  <v-card v-bind="props" color="surface-light" height="140px">
                    <v-img :src="useFileUri(editedItem.avatar)" height="140px" width="140px"></v-img>
                    <v-btn icon="mdi-close" class="opacity-0 position-absolute" :class="{ 'opacity-100': isHovering }"
                      style="left: 50%; top: 50%; transform: translate(-50%,-50%);"
                      @click="editedItem.avatar = null; coverFile = null"></v-btn>
                  </v-card>
                </v-hover>
                <v-file-upload v-else :height="140" :width="140"  v-model="coverFile" density="comfortable" title="头像"
                  accept=".png,.jpg" @update:model-value="handleCoverFileUpdate">
                </v-file-upload>
              </v-col>
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
        <v-card-title class="text-h5">您确定要删除此用户吗？</v-card-title>
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
import { OrgApi } from '@/api/user/org';
import { RoleApi } from '@/api/user/role';
import { UserApi } from '@/api/user/user';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { VSpacer } from 'vuetify/components';

import { FileApi } from '@/api/file';
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { useObjectUrl } from '@vueuse/core';
import { useFileUri } from '@/utils/simulation-uri';

const route = useRoute()
const selected = defineModel()
const props = defineProps({
  rids: { type: [String, Number, Array] },
  enableSelection: { type: Boolean, default: false }

})
const search = reactive({ name: '', role: null, org: null, orgItem: null })
const options = ref({ page: 1, itemsPerPage: 5 })
const headers = ref([
{
    title: '头像',
    key: 'avatar',
    sortable: false,
    align: 'center',
  },
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
  cover: '',
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
const coverFile = ref(null)
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
const formTitle = computed(() => editedIndex.value === -1 ? '新增用户' : '编辑用户')

const orgItemNames = computed(() => {
  if (editedItem.value.orgItem) {
    return orgNames(editedItem.value.orgItem).reverse()
  }
  return null;
})
const searchOrgItemNames = computed(() => {
  if (search.orgItem) {
    return orgNames(search.orgItem).reverse()
  }
  return null;
})
const orgNames = (org) => {
  if (org.parent) return [org.name, ...orgNames(org.parent)]
  else return [org.name]
}

watch(() => [props.rids, route.params.rids], () => {
  options.value.page = 1
  loadRoles()
})

const handleBatchUsersChange = () => {
  loadItems(options.value)
}

const handleSelectionOrgConfirm = async (value) => {
  editedItem.value.org = value.join(',')
  editedItem.value.orgItem = await OrgApi.selectOneAndParentById(editedItem.value.org)
}
const handleSearchSelectionOrgConfirm = async (value) => {
  search.org = value.join(',')
  search.orgItem = await OrgApi.selectOneAndParentById(search.org)
}

const addItem = () => {  
  coverFile.value = null
  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1;
  dialog.value = true
}

const editItem = async (item) => {
  
  coverFile.value = null
  if (item) 
  {    
    editedIndex.value = serverItems.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedItem.value.orgItem = await OrgApi.selectOneAndParentById(item.org)
  }else
  {
    editedItem.value = Object.assign({}, defaultItem.value)
    coverFile.value = null
  }
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
    coverFile.value = null
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
  if (coverFile.value) {
    console.log("coverFile.value :" + coverFile.value)
    // editedItem.value.avatar = coverFile.value
    // console.log("editedItem.value.avatar.value :" + editedItem.value.avatar)
    const coverConfig = await FileApi.upload(coverFile.value, 'simteaching/user/avatar', true)
    console.log("coverConfig :" + coverConfig.url)
    editedItem.value.avatar = coverConfig.url
  }
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
      role: search.role,
      org: search.org
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
const handleCoverFileUpdate = (file) => {
  editedItem.value.avatar = useObjectUrl(file).value
}
onMounted(() => {
  loadRoles()
})

</script>


<style scoped></style>
