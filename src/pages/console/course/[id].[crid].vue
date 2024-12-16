<template>
  <v-container fluid max-width="1000px" min-height="800px">
    <div class="d-flex" :style="{ 'margin-left': $vuetify.display.mdAndDown ? '0' : '-50px' }">
      <v-icon v-if="courseResource.type == 'resource' && !$vuetify.display.mdAndDown" icon="mdi-book-outline" size="40"
        class="mr-2" />
      <v-icon v-if="courseResource.type == 'simulation' && !$vuetify.display.mdAndDown" icon="mdi-test-tube" size="40"
        class="mr-2" />
      <v-icon v-if="courseResource.type == 'questions' && !$vuetify.display.mdAndDown" icon="mdi-head-question-outline"
        size="40" class="mr-2" />
      <v-icon v-if="courseResource.type == 'testpaper' && !$vuetify.display.mdAndDown" icon="mdi-ab-testing" size="40"
        class="mr-2" />
      <span class="text-h4"> {{ title }}</span>
    </div>
    <div class="my-2 text-body-2 text-medium-emphasis">
      {{ item.creator }} • {{ useDateFormat(item.createTime, 'YYYY-MM-DD') }}
    </div>
    <div class="text-body-2 font-weight-medium">
      {{ item.score }} 分
    </div>
    <VDivider class="my-4"></VDivider>
    <v-skeleton-loader :loading="loading" height="240" type="image, list-item-two-line">
      <v-responsive>
        <!-- <v-empty-state headline="No Messages Yet"
      text="You haven't received any messages yet. When you do, they'll appear here."
      title="Check back later."></v-empty-state> -->
        <!-- <v-responsive :aspect-ratio="16 / 9" >
      <iframe src="https://aliyun-x.oss-cn-hangzhou.aliyuncs.com/BJDXMY/webgl/index.html" class="w-100 h-100 border-0	">
      </iframe>
    </v-responsive> -->
        <!-- <div class="border pa-4">
      <v-img
        src="https://yigee-file.oss-cn-beijing.aliyuncs.com/simteaching/resource/courseware/6ca7cc0a-8fbf-4e3a-aef3-d75f93209cbe.png"></v-img>
    </div> -->
        <!-- <div class="border pa-4">
          <div class="text-h6 mb-2">
            {{ item.name }}
          </div>
          <QuestionsOptions :type="item.type" v-model:answer="item.answer" v-model:options="item.options">
          </QuestionsOptions>
        </div> -->
        <div class="border pa-4">
        </div>
      </v-responsive>
    </v-skeleton-loader>
    <VDivider class="my-4"></VDivider>
    <!-- <v-btn prepend-icon="mdi-check" color="indigo" class="float-right	">标记已完成</v-btn> -->
    <v-btn prepend-icon="mdi-check" color="indigo" class="float-right	">提交</v-btn>
  </v-container>
</template>

<script setup>
import { CourseResourceApi } from '@/api/course/course-resource';
import { ResourceApi } from '@/api/resource/resource';
import { ResourceQuestionsApi } from '@/api/resource/resource-questions';
import { ResourceSimulationApi } from '@/api/resource/resource-simulation';
import { useDateFormat } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const loading = ref(true)
const courseResource = ref({
  id: '',
  cid: '',
  rid: '',
  sid: '',
  type: 'simulation',
  score: 100,
})

const item = ref({
  name: '',
  score: 0,
  creator: 'shuo wang',
  createTime: new Date(),
  type: '单选题',
  answer: null,
  options: []
})

const title = computed(() => {
  return item.value.name.length > 20 ? substring(0, 20) + '...' : item.value.name
})

const loadCourseResourceItem = async () => {
  loading.value = true
  const res = await CourseResourceApi.info(route.params.crid)
  console.log(res)
  item.value.score = res.score
  item.value.createTime = res.createTime
  if (res.type == 'resource') {
    const resource = await ResourceApi.info(res.id)
  } else if (res.type == 'simulation') {
    const simulation = await ResourceSimulationApi.info(res.id)
  } else if (res.type == 'questions') {
    const question = await ResourceQuestionsApi.info(res.rid)
    item.value.type = question.type
    item.value.options = question.options.map(item => item.name)
    item.value.name = question.name
  } else if (res.type == 'testpaper') { }

  loading.value = false
}

onMounted(() => {
  loadCourseResourceItem()
})
</script>

<style lang="scss" scoped></style>
