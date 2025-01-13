<template>
  <div>
    <v-responsive class="text-center mx-auto my-10" max-width="700">
      <p class="font-weight-bold text-h4 mb-2">团队成员</p>

      <p class="text-subtitle-1 text-medium-emphasis">
        清晰地列出每位成员的姓名和在团队中担任的职位。
      </p>
    </v-responsive>

    <v-data-iterator :items="team" :items-per-page="3" :search="search">
      <template v-slot:header>
        <v-toolbar class="px-2 rounded-lg" title="团队">
          <v-text-field v-model="search" density="comfortable" placeholder="姓名" prepend-inner-icon="mdi-magnify"
            style="max-width: 300px;" variant="solo" clearable hide-details></v-text-field>
          <v-btn prepend-icon="mdi-plus" class="ml-2" @click="addItem">新增成员</v-btn>
        </v-toolbar>
      </template>
      <template #no-data>
        <v-empty-state icon="mdi-magnify" min-height="400px"
          text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
          title="We couldn't find a match."></v-empty-state>
      </template>
      <template v-slot:default="{ items, page }">
        <v-container class="pa-2" fluid>
          <v-row dense>
            <v-col v-for="(item, index) in items" :key="item.title" cols="12" sm="4">
              <v-card class="d-flex flex-column py-12 px-8 align-center text-center ma-2" rounded="lg">
                <v-avatar color="surface-light" :image="item.raw.avatar" size="130" />
                <v-card-subtitle class="pt-6">{{ item.raw.org }}</v-card-subtitle>
                <v-card-item class="px-0 mx-3" :title="item.raw.name">
                  <template #subtitle>
                    <v-chip border="primary thin opacity-25" class="mt-3" color="primary" size="small"
                      :text="item.raw.task" />
                  </template>

                  <v-card-text class="text-caption text-medium-emphasis">{{ item.raw.intro }}</v-card-text>
                </v-card-item>

                <v-btn prepend-icon="mdi-check-decagram-outline" variant="text" text="负责人" size="x-large"
                  :color="item.raw.organizer ? 'info' : ''"
                  class="position-absolute right-0 bottom-0 rounded-0 rounded-ts-xl" :disabled="disabled"
                  @click="onChangeOrganizer((page - 1) * 3 + index)"></v-btn>

                <v-btn density="comfortable" icon="mdi-close" variant="text" size="x-large"
                  class="position-absolute right-0 top-0 mr-2 mt-2" :disabled="disabled"
                  @click="deleteItem(item.raw)"></v-btn>

                <v-btn density="comfortable" icon="mdi-account-edit-outline" variant="text" size="x-large"
                  class="position-absolute right-0 top-0 mr-14 mt-2" :disabled="disabled"
                  @click="editItem(item.raw)"></v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn :disabled="page === 1" density="comfortable" icon="mdi-arrow-left" variant="tonal" rounded
            @click="prevPage"></v-btn>

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn :disabled="page >= pageCount" density="comfortable" icon="mdi-arrow-right" variant="tonal" rounded
            @click="nextPage"></v-btn>
        </div>
      </template>
    </v-data-iterator>

    <v-dialog v-model="dialogEdit" max-width="600">
      <v-card prepend-icon="mdi-account" title="成员">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" class="pa-4 text-center" style="justify-items: center;">
              <v-hover v-if="editedItem.avatar" v-slot="{ isHovering, props }">
                <v-avatar v-bind="props" color="surface-variant" size="130">
                  <v-img :src="editedItem.avatar"></v-img>
                  <v-btn icon="mdi-close" class="opacity-0 position-absolute" :class="{ 'opacity-100': isHovering }"
                    style="left: 50%; top: 50%; transform: translate(-50%,-50%);"
                    @click="editedItem.avatar = null; avatarFile = null"></v-btn>
                </v-avatar>
              </v-hover>
              <v-file-upload v-else v-model="avatarFile" density="comfortable" title="头像" width="150px" height="150px"
                accept=".png,.jpg" @update:model-value="handleAvatarFileUpdate"></v-file-upload>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedItem.name" label="姓名" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="editedItem.org" label="组织" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedItem.task" label="承担任务" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedItem.intro" label="简介" required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="取消" variant="plain" :disabled="disabled" @click="close"></v-btn>

          <v-btn color="primary" text="提交" variant="tonal" :disabled="disabled" @click="save"></v-btn>
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
  </div>
</template>

<script setup>
import { useBase64 } from '@vueuse/core'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { nextTick, ref } from 'vue';

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const team = defineModel()
const search = ref('')

const dialogEdit = ref(false)
const dialogDelete = ref(false)

const editedIndex = ref(-1)
const editedItem = ref({
  avatar: '',
  name: '',
  org: '',
  organizer: false,
  task: '',
  intro: ''
})
const defaultItem = ref({
  avatar: '',
  name: '',
  org: '',
  organizer: false,
  task: '',
  intro: ''
})

const avatarFile = ref(null)

const handleAvatarFileUpdate = async (file) => {
  editedItem.value.avatar = await useBase64(file).promise.value
}

const onChangeOrganizer = (index) => {
  team.value.forEach((element, i) => {
    if (index == i)
      element.organizer = true
    else
      element.organizer = false
  });
}

const close = () => {
  dialogEdit.value = false
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

const addItem = () => {
  editedItem.value = Object.assign({}, defaultItem.value)
  editedIndex.value = -1;
  dialogEdit.value = true
}

const editItem = async (item) => {
  editedIndex.value = team.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogEdit.value = true
}

const deleteItem = (item) => {
  editedIndex.value = team.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true;
}

const save = async () => {
  if (editedIndex.value > -1) {
    team.value[editedIndex.value] = { ...editedItem.value }
  } else {
    team.value.push({ ...editedItem.value })
  }
  close()
}

const deleteItemConfirm = async () => {
  if (editedIndex.value > -1) {
    team.value.splice(editedIndex.value, 1)
  }
  closeDelete()
}


</script>

<style lang="scss" scoped></style>
