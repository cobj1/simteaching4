<template>
  <v-container class="pa-md-6" fluid max-width="1600px" min-height="800px">
    <v-row v-if="item.checkStatus == 1">
      <v-col cols="12" md="7" order="2" order-md="1">
        <v-img color="surface-light" :aspect-ratio="16 / 9" rounded="lg" :src="item.cover" />

        <v-responsive class="mt-6">
          <v-tabs v-model="tab" color="primary" @update:modelValue="handleTabUpdate">
            <v-tab class="text-none" text="用户评论" value="reviews" />
            <v-tab class="text-none" text="团队" value="team" />
            <v-tab class="text-none" text="设备条件" value="deviceCondition" />
            <v-tab class="text-none" text="教学目标" value="target" />
            <v-tab class="text-none" text="实验原理" value="principle" />
            <v-tab class="text-none" text="实验步骤" value="steps" />
          </v-tabs>

          <v-divider />

          <v-tabs-window v-model="tab" class="mt-4">
            <v-tabs-window-item value="reviews">
              <v-list-item v-for="(item, i) in reviews" :key="i" class="px-0" lines="three" :subtitle="item.date"
                :title="item.user.name">
                <template #prepend>
                  <v-avatar class="hidden-sm-and-down" color="grey-darken-3" :image="item.user.avatar" size="small" />
                </template>

                <v-rating color="amber-darken-2" density="compact" :model-value="item.rate" readonly size="small" />

                <p class="text-body-2 text-medium-emphasis">{{ item.comment }}</p>

                <v-divider class="mt-6" />
              </v-list-item>
              <v-container class="pa-2 pl-12" fluid v-if="accountStore.token">
                <p class="mt-2 text-h5 font-weight-bold">
                  添加实验评论
                </p>

                <p class="mt-4 mb-6 text-body-1 text-medium-emphasis">
                  实验评论是学术交流的重要方式，可以分享研究成果，接受同行评议，促进合作研究。
                </p>

                <v-rating hover :length="5" :size="32" v-model="rate" color="warning" active-color="warning" />

                <v-textarea v-model="message" class="mt-4" color="primary" density="compact" label="评论内容"
                  variant="outlined" />

                <v-btn class="text-none" color="primary" height="50" text="发表评论" variant="flat" width="100%"
                  :disabled="message.length == 0" @click="onSendMessage" />

                <p class="mt-4 text-medium-emphasis">避免违规言论的传播，净化网络环境。</p>
              </v-container>
            </v-tabs-window-item>

            <v-tabs-window-item value="team">
              <v-row class="mt-sm-8">
                <v-col v-for="(item, i) in team" :key="i" class="mt-8 text-center" cols="6" lg="2" md="3" sm="4">
                  <v-avatar color="surface-light" :image="item.avatar" size="80" />

                  <v-list-item class="mt-2" :subtitle="item.task" :title="item.name" />
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="deviceCondition">
              <div v-html="deviceCondition" class="pa-4"></div>
            </v-tabs-window-item>
            <v-tabs-window-item value="target" class="pa-4">
              <div v-html="target"></div>
            </v-tabs-window-item>
            <v-tabs-window-item value="principle" class="pa-4">
              <div v-html="principle"></div>
            </v-tabs-window-item>
            <v-tabs-window-item value="steps" class="pa-4">
              <div v-html="steps"></div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-responsive>
      </v-col>

      <v-col class="px-md-4" cols="12" md="5" order="1" order-md="2">
        <v-rating color="amber-darken-2" density="compact" model-value="4" readonly />

        <div class="text-md-h4 font-weight-bold mb-2 text-h5">{{ item.name }} </div>

        <p class="text-caption font-weight-bold mb-4 text-medium-emphasis">{{ item.author }} | {{ item.org }}</p>

        <div class="text-body-1 mb-4 text-medium-emphasis">
          {{ item.intro }}
        </div>

        <v-row>
          <v-col cols="6" lg="6" md="12">
            <v-btn block class="text-none" color="primary" flat rounded="lg" size="large" text="做实验"
              @click="playSimulation" />
          </v-col>

          <v-col cols="6" lg="6" md="12">
            <v-btn block class="text-none" color="primary" flat rounded="lg" size="large" text="引导视频" variant="tonal"
              @click="playVideo" />
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <p class="text-body-1 font-weight-bold mt-4 mb-2">特点</p>

        <ul class="ps-5">
          <li v-for="feature in features" :key="feature" class="pa-0" density prepend-icon="mdi-circle-small">
            <span class="text-body-2">{{ feature.label }} : {{ feature.value }}</span>
          </li>
        </ul>

        <v-divider class="my-6" />

        <p class="text-body-1 font-weight-bold mt-4 mb-2">详细信息</p>

        <p class="text-body-2 mb-4 text-medium-emphasis">
          {{ item.details }}
        </p>

        <v-divider class="my-6" />

        <p class="text-body-1 font-weight-bold mt-4 mb-2">分享</p>

        <v-btn v-for="icon in icons" :key="icon" color="medium-emphasis" :icon="icon" size="small" variant="text" />
      </v-col>
    </v-row>
    <v-empty-state v-else icon="$error" min-height="500px">
      <template v-slot:media>
        <v-icon color="surface-variant"></v-icon>
      </template>

      <template v-slot:headline>
        <div class="text-h4 mt-2">
          当前实验拒绝访问
        </div>
      </template>

      <template v-slot:title>
        <div class="text-h6">
          <span v-if="item.checkStatus == 0">实验等待审核中</span>
          <span v-else>实验未通过审核</span>
        </div>
      </template>

      <template v-slot:text>
        <div class="text-medium-emphasis text-caption">
          审核实验能够确保实验设计、操作流程、数据采集和分析方法的科学性和合理性。通过同行或专家的审核，可以发现潜在的偏差和不足，从而提高研究的质量。
        </div>
      </template>
    </v-empty-state>

    <v-dialog v-model="dialog" persistent fullscreen scrollable>
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
          <v-toolbar-title> {{ item.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" prepend-icon="mdi-fullscreen" @click="enter()">全屏模式</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="w-100 h-100 d-flex ga-2">
          <div class="w-100 h-100 pa-8 position-relative	">
            <iframe ref="simulationRef" :src="item.uri" class="w-100 h-100 border-0 elevation-8 rounded-lg"></iframe>
            <v-overlay v-model="overlay" contained disabled offset persistent class="align-center justify-center">
              <v-btn @click="overlay = false">
                实验已提交，点击继续操作
              </v-btn>
            </v-overlay>
          </div>
          <v-card max-width="500px" width="100%" class="elevation-0 border-s-lg flex-shrink-0 d-flex flex-column">
            <v-card-title> 实验报告 </v-card-title>

            <v-divider class="mb-2" />

            <v-card-text>
              <v-sheet height="100%" class="lab-report">
                <ckeditor v-model="item.report" :editor="editor" :config="editorConfig" />
              </v-sheet>
            </v-card-text>

            <v-divider class="mt-2" />
          </v-card>
        </div>
        <v-card-actions>
          <v-btn prepend-icon="mdi-test-tube" :disabled="item.result.score == null"
            @click="dialogResult = true">查看实验结果</v-btn>
          <v-spacer></v-spacer>
          <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
          <v-btn color="primary" text="提交" variant="tonal" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogResult" max-width="1200" scrollable :fullscreen="fullscreen || $vuetify.display.smAndDown">
      <v-card :title="item.name">
        <template #append v-if="!$vuetify.display.smAndDown">
          <v-btn :icon="fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
            @click="fullscreen = !fullscreen"></v-btn>
        </template>
        <template v-slot:text>
          <VSimulationResultView :simulation="item.result"></VSimulationResultView>
        </template>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="关闭" variant="text" @click="dialogResult = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import { useDateFormat, useFullscreen } from '@vueuse/core';
import GLightbox from 'glightbox';
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { DeclareApi } from '@/api/declare';
import { useRoute } from 'vue-router';
import { CommentApi } from '@/api/comment';
import { FileApi } from '@/api/file';
import { useAccountStore } from '@/stores/account';
import { notify } from '@kyvg/vue3-notification';

const accountStore = useAccountStore()
const route = useRoute()
const editor = ref(ClassicEditor)
const editorConfig = reactive({
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
  heigth: '500px'
})
const simulationRef = ref(null)
const dialog = ref(false)
const dialogResult = ref(false)
const fullscreen = ref(false)
const overlay = ref(false)
const { enter } = useFullscreen(simulationRef)

const item = ref({
  checkStatus: 0,
  name: '薄荷油微囊的制备',
  cover: null,
  uri: null,
  author: null,
  org: null,
  intro: null,
  details: null,
  // details
  deviceCondition: null,
  guideVideo: null,
  introVideo: null,
  principle: null,
  steps: null,
  target: null,
  team: null,
  // simulation
  report: null,
  result: {}
})

const tab = ref(null)
const features = ref([])
const icons = [
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]
const reviews = ref([])
const team = ref([])
const deviceCondition = ref()
const target = ref()
const principle = ref()
const steps = ref()
const rate = ref(5)
const message = ref('')

const playSimulation = () => {
  dialog.value = true
}

const playVideo = () => {
  const myGallery = GLightbox({
    plyr: { css: '/glightbox/plyr.css', js: '/glightbox/plyr.js', },
    elements: [{ 'href': FileApi.filePath + item.value.introVideo, 'type': 'video', }],
  });
  myGallery.open();
}

const handleTabUpdate = async (value) => {
  if (value == 'team' && team.value.length == 0 && item.value[value]) {
    try {
      const res = await FileApi.downloadTxt(item.value[value])
      team.value = JSON.parse(res)
    } catch (e) { /* empty */ }
  }
  if (value == 'deviceCondition' && !deviceCondition.value && item.value[value]) {
    try {
      const res = await FileApi.downloadTxt(item.value[value])
      deviceCondition.value = res
    } catch (e) { /* empty */ }
  }
  if (value == 'target' && !target.value && item.value[value]) {
    try {
      const res = await FileApi.downloadTxt(item.value[value])
      target.value = res
    } catch (e) { /* empty */ }
  }
  if (value == 'principle' && !principle.value && item.value[value]) {
    try {
      const res = await FileApi.downloadTxt(item.value[value])
      principle.value = res
    } catch (e) { /* empty */ }
  }
  if (value == 'steps' && !steps.value && item.value[value]) {
    try {
      const res = await FileApi.downloadTxt(item.value[value])
      steps.value = res
    } catch (e) { /* empty */ }
  }
}

const handleSimulationMessage = (event) => {
  if (event && event.data && 'object' == typeof event.data) {
    item.value.result = event.data
    dialogResult.value = true
    overlay.value = true
  }
}

const onSendMessage = async () => {
  const res = await CommentApi.save({
    cid: route.params.id, comment: message.value, rate: rate.value
  })
  if (res) {
    loadItem()
    notify({
      title: "评论发表成功",
      type: "info",
    });
    message.value = ''
    rate.value = 5
  } else {
    notify({
      title: "评论发表失败",
      type: "info",
    });
  }
}

const loadItem = async () => {
  const declare = await DeclareApi.info(route.params.id)
  item.value.checkStatus = declare.checkStatus
  item.value.cover = FileApi.filePath + declare.cover
  item.value.name = declare.name
  item.value.uri = declare.uri
  item.value.author = declare.author
  item.value.org = declare.org
  item.value.intro = declare.intro
  item.value.details = declare.details
  features.value = [
    { label: '专业类型', value: declare.category },
    { label: '实验类型', value: declare.type }
  ]
  reviews.value = []
  const comments = await CommentApi.list(route.params.id)
  comments.forEach(comment => {
    reviews.value.push({
      comment: comment.comment,
      rate: comment.rate,
      date: useDateFormat(new Date(comment.date), 'YYYY年MM月DD日').value,
      user: {
        avatar: comment.ucover,
        name: comment.uname,
      },
    })
  })

  const details = await DeclareApi.detailsInfo(route.params.id)
  item.value.deviceCondition = details.deviceCondition
  item.value.guideVideo = details.guideVideo
  item.value.introVideo = details.introVideo
  item.value.principle = details.principle
  item.value.steps = details.steps
  item.value.target = details.target
  item.value.team = details.team
}

onMounted(() => {
  loadItem()

  window.addEventListener('message', handleSimulationMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleSimulationMessage)
})
</script>

<style lang="scss" scoped>
.lab-report:deep(.ck-editor__editable_inline) {
  height: calc(100vh - 260px);
  overflow-y: auto;
}
</style>
