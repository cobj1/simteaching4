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
          <CourseTabInfo :data="data" @change="loadItem"></CourseTabInfo>
        </v-tabs-window-item>
        <v-tabs-window-item value="coursework">
          <CourseTabCoursework v-model:list="list" v-model:subjects="subjects" :cid="route.params.id"
            @change="loadItems" @save="handleCourseTabCourseworkSave" @del="handleCourseTabCourseworkDel"
            @change-order="handleCourseTabCourseworkChangeOrder">
          </CourseTabCoursework>
        </v-tabs-window-item>
        <v-tabs-window-item value="user">
          <CourseTabUser :data="data"></CourseTabUser>
        </v-tabs-window-item>
        <v-tabs-window-item value="grade">
          <v-container fluid max-width="1000px" min-height="800px">
            grade
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-sheet>
  </VCard>
</template>

<script setup>
import { CourseApi } from '@/api/course';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { CourseSubjectApi } from '@/api/course/course-subject';
import { CourseResourceApi } from '@/api/course-resource';

const route = useRoute()
const data = ref({
  id: null,
  name: ''
})
const tab = ref('user')
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
const list = ref([])
const subjects = ref([])

watch(() => route.params.id, () => {
  loadItem()
  loadItems()
})
const handleCourseTabCourseworkDel = async (id) => {
  await CourseResourceApi.del(id)
  loadItems()
}
const handleCourseTabCourseworkSave = async (array) => {
  await CourseResourceApi.save(array)
  loadItems()
}
const handleCourseTabCourseworkChangeOrder = async () => {
  const newList = []
  newList.push(...list.value)
  subjects.value.forEach(subject => newList.push(...subject.children.map(item => { return { ...item, sid: subject.id } })))
  await CourseResourceApi.save(newList.map(item => {
    return {
      cid: item.cid,
      rid: item.rid,
      sid: item.sid,
      type: item.type
    }
  }), true, route.params.id)
}

const loadItem = async () => {
  data.value = await CourseApi.info(route.params.id)
}
const loadItems = async () => {
  const res = await CourseResourceApi.list(route.params.id)
  subjects.value = (await CourseSubjectApi.list(route.params.id)).map(subject => { return { ...subject, children: res.filter(item => item.sid == subject.id) || [] } })
  list.value = res.filter(item => !item.sid)
}
onMounted(() => {
  loadItem()
  loadItems()
})
</script>

<style scoped>

</style>
