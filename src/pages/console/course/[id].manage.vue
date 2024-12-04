<template>
  <VCard>
    <VToolbar :title="data.name"> </VToolbar>
    <v-sheet elevation="3" rounded="lg">
      <v-tabs v-model="tab" :items="tabs" height="50" slider-color="#f78166" class="pl-4 ">
        <template v-slot:tab="{ item }">
          <v-tab :prepend-icon="item.icon" :text="item.text" :value="item.value" class="text-none"></v-tab>
        </template>
      </v-tabs>
      <VDivider></VDivider>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="info">
          <CourseTabInfo :data="data" manage @change="loadItem"></CourseTabInfo>
        </v-tabs-window-item>
        <v-tabs-window-item value="coursework">
          <CourseTabCoursework :cid="route.params.id" manage></CourseTabCoursework>
        </v-tabs-window-item>
        <v-tabs-window-item value="user">
          <CourseTabUser :data="data" manage></CourseTabUser>
        </v-tabs-window-item>
        <v-tabs-window-item value="grade">
          <CourseTabResult></CourseTabResult>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-sheet>
  </VCard>
</template>

<script setup>
import { CourseApi } from '@/api/course';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const data = ref({
  id: null,
  name: ''
})
const tab = ref('coursework')
const tabs = ref([
  {
    icon: 'mdi-book-open-page-variant',
    text: '课程信息',
    value: 'info',
  },
  {
    icon: 'mdi-handshake-outline',
    text: '课业',
    value: 'coursework',
  },
  {
    icon: 'mdi-shield-lock-outline',
    text: '用户',
    value: 'user',
  },
  {
    icon: 'mdi-license',
    text: '成绩',
    value: 'grade',
  },
])


watch(() => route.params.id, () => {
  loadItem()
})



const loadItem = async () => {
  data.value = await CourseApi.info(route.params.id)
}

onMounted(() => {
  loadItem()
})
</script>

<style scoped></style>
