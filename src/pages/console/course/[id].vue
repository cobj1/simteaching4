<template>
  <VCard width="100%" :loading="loading">
    <VToolbar :title="data.name"> </VToolbar>
    <v-sheet v-if="!Forbidden" elevation="3" rounded="lg">
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
          <CourseTabCoursework :cid="route.params.id"></CourseTabCoursework>
        </v-tabs-window-item>
        <v-tabs-window-item value="user">
          <CourseTabUser :data="data"></CourseTabUser>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-sheet>
    <v-empty-state v-else icon="$error" min-height="500px">
      <template v-slot:media>
        <v-icon color="surface-variant"></v-icon>
      </template>

      <template v-slot:headline>
        <div class="text-h4 mt-2">
          当前课程拒绝访问
        </div>
      </template>

      <template v-slot:title>
        <div class="text-h6">
          <span v-if="data.checked != 1">课程未通过审核</span>
          <span v-else>课程未在开放时间段内</span>
        </div>
      </template>

      <template v-slot:text>
        <div class="text-medium-emphasis text-caption">
          课程拒绝访问是系统安全、数据保护、教学管理和合规性的重要组成部分。通过合理配置访问权限，可以有效地保护敏感信息、维护系统安全、支持教学运营，并符合相关法律法规和合规要求。
        </div>
      </template>
    </v-empty-state>

  </VCard>
</template>

<script setup>
import { CourseApi } from '@/api/course/course';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const data = ref({
  id: null,
  name: ''
})
const tab = ref(route.query.tab || 'info')
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
  }
])
const Forbidden = ref(false)
const loading = ref(true)

watch(() => route.params.id, () => {
  loadItem()
})
watch(tab, (value) => router.replace({ path: route.fullPath, query: { tab: value } }))

const loadItem = async () => {
  loading.value = true
  data.value = await CourseApi.info(route.params.id)
  Forbidden.value = !(data.value.checked == 1 && new Date().getTime() >= new Date(data.value.startTime).getTime() && new Date().getTime() <= new Date(data.value.stopTime).getTime())
  setTimeout(() => loading.value = false, 300)
}

onMounted(() => {
  loadItem()
})
</script>

<style scoped></style>
