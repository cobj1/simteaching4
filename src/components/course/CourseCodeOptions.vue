<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-dots-vertical" variant="text" :size="30" v-bind="props"></v-btn>
    </template>
    <v-list width="200">
      <v-list-item title="复制课程代码" prepend-icon="mdi-content-copy" link @click="copycode()">
      </v-list-item>
      <v-list-item title="重制课程代码" prepend-icon="mdi-refresh" link @click="recode()"></v-list-item>
      <v-list-item title="关闭" prepend-icon="mdi-close-box-outline" link @click="stopCodeItem()">
      </v-list-item>
    </v-list>
  </v-menu>
  <v-dialog v-model="dialogStopCode" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">停用课程代码 </v-card-title>
      <v-card-subtitle>这样会移除此课程现有的课程代码。您可以在课程设置中生成新的代码。</v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeStepCode">取消</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="stopCodeItemConfirm">确定</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { CourseApi } from '@/api/course/course';
import { useClipboard } from '@vueuse/core';
import { ref } from 'vue';

const { copy } = useClipboard()
const emit = defineEmits(['change'])
const props = defineProps({ id: String, code: String })
const dialogStopCode = ref(false)

const stopCodeItem = () => {
  dialogStopCode.value = true;
}
const copycode = () => {
  copy(props.code || '')
}

const recode = async () => {
  await CourseApi.recode(props.id)
  emit('change')
}
const closeStepCode = () => {
  dialogStopCode.value = false;
}

const stopCodeItemConfirm = async () => {
  await CourseApi.stopcode(props.id)
  emit('change')
  closeStepCode()
}

</script>

<style scoped></style>
