<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="editedItem.name" label="主题名"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedItem.explain" label="说明"></v-text-field>
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
</template>

<script setup>
import { CourseSubjectApi } from '@/api/course/course-subject';
import { ref, computed, nextTick } from 'vue'

const emit = defineEmits(['change'])
const dialog = ref(false)
const editedItem = ref({
  id: null,
  cid: null,
  name: '',
  explain: '',
  order: 0
})
const defaultItem = ref({
  id: null,
  cid: null,
  name: '',
  explain: '',
  order: 0
})

const formTitle = computed(() => editedItem.value.id == null ? '新增项目' : '编辑项目')

const editItem = async (cid, order, item) => {
  if (item) {
    editedItem.value = Object.assign({}, item)
  } else {
    editedItem.value = Object.assign({}, defaultItem.value)
  }
  editedItem.value.cid = cid
  editedItem.value.order = order
  dialog.value = true
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
  })
}

const save = async () => {
  await CourseSubjectApi.save(editedItem.value)
  emit('change')
  close()
}

defineExpose({
  editItem
})
</script>

<style lang="scss" scoped></style>
