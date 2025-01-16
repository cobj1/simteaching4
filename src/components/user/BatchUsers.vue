<template>
  <v-dialog v-model="dialog" activator="parent" max-width="1200" scrollable>
    <template v-slot:default>
      <v-card prepend-icon="mdi-earth" title="批量导入用户">
        <template #append>
          <v-btn prepend-icon="mdi-download" @click="download">下载模板</v-btn>
        </template>
        <v-divider></v-divider>

        <v-file-upload v-model="file" title="上传文件" divider-text="或" browse-text="浏览文件" accept=".xlsx"
          :density="file ? 'compact' : 'default'" @update:model-value="handleFileUpdate"></v-file-upload>

        <v-card-text v-if="file" class="px-4 d-flex">
          <v-data-table-virtual v-model="selected" :headers="headers" :items="items" fixed-header item-value="index"
            show-select height="100%" :loading="saving">
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.status="{ item }">
              <div v-show="item.status == 0"> - </div>
              <div v-show="item.status == 1"> 等待 </div>
              <div v-show="item.status == 2" class="text-red"> 失败
                <v-tooltip v-if="item.message" :text="item.message">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-help-circle-outline" size="20px" class="ml-2"></v-icon>
                  </template>
                </v-tooltip>
              </div>
              <div v-show="item.status == 3" class="text-teal"> 成功 </div>
            </template>
          </v-data-table-virtual>
        </v-card-text>

        <selection-org-btn v-show="file" v-model="org"></selection-org-btn>

        <v-divider></v-divider>

        <v-card-actions>

          <v-spacer></v-spacer>

          <v-btn text="取消" @click="close()"></v-btn>

          <v-btn color="surface-variant" text="导入" variant="flat" :disabled="!org || selected.length == 0"
            :loading="saving" @click="save()"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { read, utils } from "xlsx";
import FileSaver from 'file-saver';
import { nextTick, ref } from 'vue';
import { UserApi } from '@/api/user/user';
import { useRoute } from 'vue-router';

const emit = defineEmits(['change'])

const route = useRoute()

const dialog = ref(false)
const file = ref()
const org = ref()

const headers = ref([
  { title: '姓名', align: 'start', key: 'name' },
  { title: '账号', align: 'start', key: 'account' },
  { title: '密码', align: 'start', key: 'password' },
  { title: '手机号', align: 'start', key: 'phone' },
  { title: '邮箱', align: 'start', key: 'email' },
  { title: '岗位', align: 'start', key: 'post' },
  { title: '状态', align: 'end', key: 'status' },
])
const items = ref([])
const selected = ref([])

const saving = ref(false)

const handleFileUpdate = async (file) => {
  items.value = []
  selected.value = []

  if (file) {
    const buf = await file.arrayBuffer()
    const workbook = read(buf);
    const worksheet = workbook.Sheets.Sheet1

    var data = utils.sheet_to_json(worksheet);

    data.forEach((item, index) => {
      items.value.push({
        index,
        name: item['姓名'],
        account: item['账号'],
        password: item['密码'],
        phone: item['手机号'],
        email: item['邮箱'],
        post: item['岗位'],
        status: 0,
        message: null
      })
      selected.value.push(index)
    })
  }
}

const download = () => {
  FileSaver.saveAs('/file/template-users.xlsx', 'template-users.xlsx')
}

const close = () => {
  dialog.value = false

  nextTick(() => {
    file.value = null
    items.value = []
  })
}

const save = async () => {
  saving.value = true
  const results = await UserApi.batch({
    org: org.value.join(','),
    role: route.params.rids,
    users: selected.value.map(index => items.value[index])
  })
  if (results) {
    results.forEach(result => {
      items.value[result.index].status = result.status
      items.value[result.index].message = result.message
    })
  }
  setTimeout(() => saving.value = false, 200)
  emit('change')
}
</script>

<style lang="scss" scoped></style>
