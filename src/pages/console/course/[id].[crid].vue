<template>
  <v-container fluid max-width="1000px" min-height="800px">
    <div class="d-flex" :style="{ 'margin-left': $vuetify.display.mdAndDown ? '0' : '-50px' }">
      <v-icon v-if="item.type == 'resource' && !$vuetify.display.mdAndDown" icon="mdi-book-outline" size="40"
        class="mr-2" />
      <v-icon v-if="item.type == 'simulation' && !$vuetify.display.mdAndDown" icon="mdi-test-tube" size="40"
        class="mr-2" />
      <v-icon v-if="item.type == 'questions' && !$vuetify.display.mdAndDown" icon="mdi-head-question-outline" size="40"
        class="mr-2" />
      <v-icon v-if="item.type == 'testpaper' && !$vuetify.display.mdAndDown" icon="mdi-ab-testing" size="40"
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
        <div class="border pa-4" v-if="item.type == 'resource'">
          <a v-if="item.ext == 'png'" :href="item.url" class="glightbox">
            <img :src="item.url" alt="image" class="w-100" />
          </a>
          <video v-if="item.ext == 'mp4'" :src="item.url" id="player"></video>
          <audio v-if="item.ext == 'mp3'" :src="item.url" controls preload class="d-flex ma-auto my-8"> </audio>
          <vue-office-docx v-if="item.ext == 'docx'" :src="item.url" style="height: calc(100vh - 300px)" />
          <vue-office-excel v-if="item.ext == 'xlsx'" :src="item.url" style="height: calc(100vh - 300px)" />
          <vue-office-pdf v-if="item.ext == 'pdf'" :src="item.url" style="height: calc(100vh - 300px)" />
          <section v-if="['xml', 'txt', 'sql'].includes(item.ext)">
            <p v-text="item.text"> </p>
          </section>
        </div>
        <div class="border pa-4" v-else-if="item.type == 'simulation'" ref="simulationRef">
          <v-responsive :aspect-ratio="16 / 9" class="w-100 h-100" min-height="300px"
            :style="angle && $vuetify.display.mdAndDown ? { 'position': 'fixed', 'top': 0, 'left': 0, 'z-index': '910' } : null">
            <iframe :src="item.url" class="w-100 h-100 border-0	">
            </iframe>
          </v-responsive>
          <div class="pa-2 text-center" v-if="!$vuetify.display.mdAndDown">
            <v-btn variant="text" prepend-icon="mdi-fullscreen" @click="enter()">全屏模式</v-btn>
          </div>
        </div>
        <div class="border pa-4" v-else-if="item.type == 'questions'">
          <div class="mb-2">
            {{ item.name }}
          </div>
          <QuestionsOptions :type="item.qtype" v-model:answer="item.answer" v-model:options="item.options">
          </QuestionsOptions>
        </div>
        <div v-else-if="item.type == 'testpaper'">
          <v-card class="pa-4 ma-1 mb-4" v-for="(question, index) in item.questions" :key="index">
            <div class="mb-2">
              {{ question.name }}
              <span class="text-caption	text-medium-emphasis float-right">{{ question.score }} 分</span>
            </div>
            <QuestionsOptions :type="question.type" v-model:answer="question.answer" v-model:options="question.options">
            </QuestionsOptions>
          </v-card>
        </div>
        <v-empty-state v-else headline="No Messages Yet"
          text="You haven't received any messages yet. When you do, they'll appear here."
          title="Check back later."></v-empty-state>
      </v-responsive>
    </v-skeleton-loader>
    <VDivider class="my-4"></VDivider>
    <v-btn prepend-icon="mdi-check" color="indigo" class="d-flex" style="justify-self: end;"
      v-if="item.type == 'questions' || item.type == 'testpaper'" @click="finish">提交</v-btn>
    <v-btn prepend-icon="mdi-check" color="indigo" class="d-flex" style="justify-self: end;" v-else
      @click="finish">标记已完成</v-btn>
  </v-container>
</template>

<script setup>
import { fileTypeFromBlob } from 'file-type';
import Plyr from 'plyr';
import { CourseResourceApi } from '@/api/course/course-resource';
import { FileApi } from '@/api/file';
import { ResourceApi } from '@/api/resource/resource';
import { ResourceTestpaperApi } from '@/api/resource/resource-paper';
import { ResourceQuestionsApi } from '@/api/resource/resource-questions';
import { ResourceSimulationApi } from '@/api/resource/resource-simulation';
import { useDateFormat, useFullscreen, useScreenOrientation } from '@vueuse/core';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'
import GLightbox from 'glightbox';

const route = useRoute()
const loading = ref(true)
const simulationRef = ref(null)
const item = ref({
  type: null,
  name: '',
  score: 0,
  creator: '',
  createTime: new Date(),
  url: null,
  ext: null,
  text: null,
  /* question */
  qtype: null,
  answer: null,
  options: [],
  questions: [],
})
const { enter } = useFullscreen(simulationRef)
const { angle } = useScreenOrientation()
const title = computed(() => {
  return item.value.name.length > 20 ? substring(0, 20) + '...' : item.value.name
})

const finish = () => {
  console.log(item.value)
}

const loadCourseResourceItem = async () => {
  loading.value = true
  const res = await CourseResourceApi.info(route.params.crid)
  item.value.type = res.type
  item.value.score = res.score
  item.value.createTime = res.createTime
  item.value.creator = res.uname
  if (res.type == 'resource') {
    const resource = await ResourceApi.info(res.rid)
    item.value.name = resource.name
    const fileRes = await fetch(FileApi.filePath + resource.url)
    const blob = await fileRes.blob()
    const fileType = await fileTypeFromBlob(blob)
    item.value.ext = fileType.ext
    item.value.url = URL.createObjectURL(blob)
    console.log(fileType.ext)
    if (['xml', 'txt', 'sql'].includes(fileType.ext)) {
      const reader = new FileReader()
      reader.readAsText(blob)
      reader.onload = () => item.value.text = reader.result
    }
  } else if (res.type == 'simulation') {
    const simulation = await ResourceSimulationApi.info(res.rid)
    item.value.name = simulation.name
    item.value.url = simulation.url.includes('http') ? simulation.url : FileApi.filePath + simulation.url
  } else if (res.type == 'questions') {
    const question = await ResourceQuestionsApi.info(res.rid)
    item.value.qtype = question.type
    item.value.options = question.options.map(item => item.name)
    item.value.name = question.name
  } else if (res.type == 'testpaper') {
    const testpaper = await ResourceTestpaperApi.exam(res.rid)
    item.value.name = testpaper.name
    item.value.questions = testpaper.questions.map(item => {
      return {
        ...item,
        options: item.options.map(item => item.name),
        answer: item.type == '多选题' ? [] : ''
      }
    })
  }
  loading.value = false
  await nextTick()
  GLightbox()
  new Plyr('#player');
}

onMounted(() => {
  loadCourseResourceItem()
})
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 1rem;
  line-height: 1.8;
  overflow-wrap: break-word;
}
</style>
