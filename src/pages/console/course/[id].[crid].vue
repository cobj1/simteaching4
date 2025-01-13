<template>
  <v-container fluid max-width="1000px" min-height="800px">
    <div class="d-flex" :style="{ 'margin-left': $vuetify.display.smAndDown ? '0' : '-50px' }">
      <v-icon v-if="item.type == 'resource' && !$vuetify.display.smAndDown" icon="mdi-book-outline" size="40"
        class="mr-2" />
      <v-icon v-if="item.type == 'simulation' && !$vuetify.display.smAndDown" icon="mdi-test-tube" size="40"
        class="mr-2" />
      <v-icon v-if="item.type == 'questions' && !$vuetify.display.smAndDown" icon="mdi-head-question-outline" size="40"
        class="mr-2" />
      <v-icon v-if="item.type == 'testpaper' && !$vuetify.display.smAndDown" icon="mdi-ab-testing" size="40"
        class="mr-2" />
      <v-icon v-if="item.type == 'report_template' && !$vuetify.display.smAndDown" icon="mdi-file-word-box-outline"
        size="40" class="mr-2" />
      <span class="text-h4"> {{ title || '资源丢失' }} </span>
    </div>
    <div class="my-2 text-body-2 text-medium-emphasis">
      {{ item.creator }} • {{ useDateFormat(item.createTime, 'YYYY-MM-DD') }}
    </div>
    <div class="text-body-2 font-weight-medium">
      {{ item.score }} 分
    </div>
    <VDivider class="my-4"></VDivider>
    <v-skeleton-loader :loading="loading" height="240" type="image, list-item-two-line">
      <v-responsive v-if="resourceItem">
        <ResourceViewResource v-if="item.type == 'resource'" v-model="resourceItem" :completed="completed">
        </ResourceViewResource>
        <ResourceViewSimulation v-else-if="item.type == 'simulation'" v-model="resourceItem" :completed="completed">
        </ResourceViewSimulation>
        <ResourceViewQuestions v-else-if="item.type == 'questions'" v-model="resourceItem" :completed="completed">
        </ResourceViewQuestions>
        <ResourceViewTestpaper v-else-if="item.type == 'testpaper'" v-model="resourceItem" :completed="completed">
        </ResourceViewTestpaper>
        <ResourceViewReportTemplate v-else-if="item.type == 'report_template'" v-model="resourceItem"
          :completed="completed">
        </ResourceViewReportTemplate>
        <v-empty-state v-else headline="No Messages Yet"
          text="You haven't received any messages yet. When you do, they'll appear here."
          title="Check back later."></v-empty-state>
      </v-responsive>
      <v-empty-state v-else headline="资源丢失" title="如果资源丢失，及时联系老师说明情况。" class="w-100 ma-8"></v-empty-state>
    </v-skeleton-loader>
    <VDivider class="my-4"></VDivider>
    <div v-if="item.type == 'questions' || item.type == 'testpaper' || item.type == 'report_template'">
      <v-btn prepend-icon="mdi-check" color="indigo" class="d-flex" style="justify-self: end;" :disabled="completed"
        @click="finish">
        <span v-if="!completed">提交</span>
        <span v-else>已提交</span>
      </v-btn>
    </div>
    <v-dialog v-model="finishDialog" contained max-width="400" persistent>
      <v-card rounded="lg">
        <template #text>
          <div class="text-center pt-4">
            <v-avatar class="mb-4" color="success" icon="mdi-check" size="x-large" variant="tonal" />
            <div class="font-weight-bold mb-2">
              完成
            </div>
            <div class="text-body-2 text-medium-emphasis mb-6">
              您的信息已成功录入。
            </div>
            <v-btn block class="text-none" color="primary" text="前往课业" variant="flat"
              @click="router.replace(`/console/course/${route.params.id}?tab=coursework`)" />
          </div>
        </template>
      </v-card>
    </v-dialog>
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
import { useDateFormat } from '@vueuse/core';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GLightbox from 'glightbox';
import { BrowseRecordApi } from '@/api/browse-record';
import { useIncrementTimeTrigger } from '@/utils/increment-time-trigger';
import { useAccountStore } from '@/stores/account';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { useFileUri } from '@/utils/simulation-uri';
import { ResourceReportTemplateApi } from '@/api/resource/resource-report-template';

const accountStore = useAccountStore()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const SupportExts = ['jpg', 'png', 'xml', 'txt', 'sql', 'mp4', 'mp3', 'docx', 'xlsx', 'pdf']
const item = ref({
  type: null,
  name: '',
  score: 0,
  creator: '',
  createTime: new Date()
})
const logItem = ref({
  id: null,
  score: 0,
  createTime: null
})
const resourceItem = ref(null)
const completed = computed(() => logItem.value.id != null)

const title = computed(() => {
  return item.value.name.length > 20 ? substring(0, 20) + '...' : item.value.name
})
const finishDialog = ref(false)

const handleSimulationMessage = (event) => {
  if (event && event.data && 'object' == typeof event.data) {
    item.value.answer = JSON.stringify(event.data)
    finish()
  }
}

const finish = () => {
  let answer;
  if (item.value.type == 'questions' && resourceItem.value.type == '多选题') {
    answer = resourceItem.value.answer.sort((a, b) => a - b).join(',')
  } else if (item.value.type == 'testpaper') {
    answer = JSON.stringify(resourceItem.value.questions.map(question => {
      if (question.type == '多选题') {
        question.answer = question.answer.sort((a, b) => a - b)
        return { qid: question.id, answer: question.answer.join(',') }
      } else return { qid: question.id, answer: question.answer }
    }))
  } else if (item.value.type == 'report_template') {
    answer = resourceItem.value.content
  }
  CourseResourceApi.finish(route.params.crid, item.value.type, answer || item.value.answer)
  finishDialog.value = true
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
    if (resource) {
      item.value.name = resource.name
      resource.url = FileApi.filePath + resource.url
      //支持在线预览的资源
      if (SupportExts.includes(resource.url.substring(resource.url.lastIndexOf('.') + 1))) {
        const fileRes = await fetch(resource.url)
        const blob = await fileRes.blob()
        const fileType = await fileTypeFromBlob(blob)
        resource.ext = fileType.ext
        resource.url = URL.createObjectURL(blob)
        if (['xml', 'txt', 'sql'].includes(fileType.ext)) {
          const reader = new FileReader()
          reader.readAsText(blob)
          reader.onload = () => resource.text = reader.result
        }
      }
      resourceItem.value = resource
    }
  } else if (res.type == 'simulation') {
    let usercode;
    try {
      const userinfo = JSON.stringify({ userno: accountStore.info.account, username: accountStore.info.name })
      const words = Utf8.parse(userinfo)
      usercode = encodeURIComponent(Base64.stringify(words))
    } catch (e) { /* empty */ }
    const simulation = await ResourceSimulationApi.info(res.rid)
    if (simulation) {
      item.value.name = simulation.name
      simulation.url = `${useFileUri(simulation.url)}?usercode=${usercode}`
      resourceItem.value = simulation
    }
  } else if (res.type == 'questions') {
    const question = await ResourceQuestionsApi.info(res.rid)
    if (question) {
      item.value.name = question.name
      question.options = question.options.map(item => item.name)
      question.answer = question.type == '多选题' ? [] : ''
      resourceItem.value = question
    }
  } else if (res.type == 'testpaper') {
    const testpaper = await ResourceTestpaperApi.exam(res.rid)
    if (testpaper) {
      item.value.name = testpaper.name
      testpaper.questions = testpaper.questions.map(item => {
        return {
          ...item,
          options: item.options.map(item => item.name),
          answer: item.type == '多选题' ? [] : '',
          answerAnalysis: item.answerAnalysis
        }
      })
      resourceItem.value = testpaper
    }
  } else if (res.type == 'report_template') {
    const reportTemplate = await ResourceReportTemplateApi.info(res.rid)
    if (reportTemplate) {
      item.value.name = reportTemplate.title
      const content = await FileApi.downloadTxt(reportTemplate.content)
      reportTemplate.content = content
      resourceItem.value = reportTemplate
    }
  }
  loading.value = false
  await nextTick()
  GLightbox()
  new Plyr('#player');
}
const loadCourseResourceLogItem = async () => {
  const res = await CourseResourceApi.logInfo(route.params.crid)
  logItem.value.id = res.id
  logItem.value.score = res.score
  logItem.value.createTime = res.createTime
}

const cid = route.params.id
const crid = route.params.crid

const { timer, clock, start, stop } = useIncrementTimeTrigger()

onMounted(async () => {
  loadCourseResourceItem()
  loadCourseResourceLogItem()

  await BrowseRecordApi.count({ cid, crid })
  // 默认两分钟保存一次
  start(60 * 2, {
    event() {
      BrowseRecordApi.time({ cid, crid, time: clock.value })
      timer.value = 0
    }
  })

  window.addEventListener('message', handleSimulationMessage)

})

onUnmounted(() => {
  stop({
    event() {
      BrowseRecordApi.time({ cid, crid, time: timer.value })
    }
  })

  window.removeEventListener('message', handleSimulationMessage)
})
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 1rem;
  line-height: 1.8;
  overflow-wrap: break-word;
}
</style>
