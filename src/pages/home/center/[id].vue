<template>
  <v-container class="pa-md-6" fluid max-width="1600px" min-height="800px">
    <v-row>
      <v-col cols="12" md="7" order="2" order-md="1">
        <v-img color="surface-light" :aspect-ratio="16 / 9" rounded="lg"
          src="https://yigee-file.oss-cn-beijing.aliyuncs.com/image/cover/boheyou.jpg" />

        <v-responsive class="mt-6">
          <v-tabs v-model="tab" color="primary">
            <v-tab class="text-none" text="用户评论" value="customer-reviews" />
            <v-tab class="text-none" text="团队" value="team" />
            <v-tab class="text-none" text="设备条件" value="device_condition" />
            <v-tab class="text-none" text="教学目标" value="target" />
            <v-tab class="text-none" text="实验原理" value="principle" />
            <v-tab class="text-none" text="实验步骤" value="steps" />
          </v-tabs>

          <v-divider />

          <v-tabs-window v-model="tab" class="mt-4">
            <v-tabs-window-item value="customer-reviews">
              <v-list-item v-for="(item, i) in reviews" :key="i" class="px-0" lines="three" :subtitle="item.user.date"
                :title="item.user.name">
                <template #prepend>
                  <v-avatar class="hidden-sm-and-down" color="grey-darken-3" :image="item.user.avatar" size="small" />
                </template>

                <v-rating color="amber-darken-2" density="compact" :model-value="item.user.rate" readonly
                  size="small" />

                <p class="text-body-2 text-medium-emphasis">{{ item.review }}</p>

                <v-divider class="mt-6" />
              </v-list-item>
            </v-tabs-window-item>

            <v-tabs-window-item value="faq">
              <div v-for="(faq, i) in faqs" :key="i" class="my-4 px-4">
                <p class="text-body-1 mb-1 font-weight-bold">{{ faq.title }}</p>

                <p class="text-caption text-medium-emphasis">{{ faq.subtitle }}</p>
              </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="license">
              <div v-for="(item, i) in licenses" :key="i" class="my-4 px-4">
                <p class="text-body-1 font-weight-bold mb-2">{{ item.title }}</p>

                <p class="text-medium-emphasis mb-2">{{ item.description }}</p>

                <ul class="ps-5">
                  <li v-for="feature in item.list" :key="feature">
                    <span class="text-body-2">{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-responsive>
      </v-col>

      <v-col class="px-md-4" cols="12" md="5" order="1" order-md="2">
        <v-rating color="amber-darken-2" density="compact" model-value="4" readonly />

        <div class="text-md-h4 font-weight-bold mb-2 text-h5">{{ item.title }} </div>

        <p class="text-caption font-weight-bold mb-4 text-medium-emphasis">武毅君 | 河南大学</p>

        <div class="text-body-1 mb-4 text-medium-emphasis">
          薄荷油微囊的制备虚拟仿真实验，遵循“虚为实用，虚实互补”原则，采用3D游戏界面，娱乐中完成学习要求，给学生全新的学习感受。
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
            <span class="text-body-2">{{ feature }}</span>
          </li>
        </ul>

        <v-divider class="my-6" />

        <p class="text-body-1 font-weight-bold mt-4 mb-2">详细信息</p>

        <p class="text-body-2 mb-4 text-medium-emphasis">
          挥发油具有挥发性、不稳定性，尽可能多的保留挥发成分是挥发油类制剂首要解决的问题。微囊是将固态或液态药物（挥发油）包裹在高分子材料中形成微小囊状物的新型制剂，多用复凝聚法制备。但其制备工艺复杂，操作时间长，形成过程不易观测，因此教学效果不好。薄荷油具有窜透性和挥发性，临床应用广泛。薄荷油微囊的制备虚拟仿真实验，遵循“虚为实用，虚实互补”原则，采用3D游戏界面，娱乐中完成学习要求，给学生全新的学习感受。
        </p>

        <v-divider class="my-6" />

        <p class="text-body-1 font-weight-bold mt-4 mb-2">分享</p>

        <v-btn v-for="icon in icons" :key="icon" color="medium-emphasis" :icon="icon" size="small" variant="text" />
      </v-col>
    </v-row>
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
import { useFullscreen } from '@vueuse/core';
import GLightbox from 'glightbox';
import { onMounted, onUnmounted, reactive, ref } from 'vue'

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
  name: '薄荷油微囊的制备',
  uri: 'https://yigee-file.oss-cn-beijing.aliyuncs.com/simulation-unzip/2024/12/25/e61be8bc-d6f8-4499-834a-2001ae49d6d1/index.html',
  report: '',
  result: {}
})

const features = [
  '专业类型：药学类',
  '实验类型：专业基础课',
]

const icons = [
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]

const tab = ref(null)

const reviews = [
  {
    review: '这门课程讲解非常清晰，从薄荷油微囊的制备原理到具体的实验操作，都进行了详细的讲解。老师的讲解深入浅出，即使是对微囊技术不太了解的同学也能很快上手。实验环节安排合理，让我们有机会亲手操作，加深了对知识的理解。课程资料也很丰富，课后复习很方便。强烈推荐！',
    user: {
      avatar: '',
      name: '张明',
      rate: 5,
      date: '2024年10月26日',
    },
  },
  {
    review: '课程内容很实用，学习到了多种制备薄荷油微囊的方法，包括乳化法、喷雾干燥法等等。老师在讲解过程中穿插了一些实际应用案例，让我们对微囊技术的应用前景有了更直观的了解。如果能在实验环节增加一些不同制备方法的对比实验就更好了。',
    user: {
      avatar: '',
      name: '李丽',
      rate: 4,
      date: '2024年10月25日',
    },
  },
  {
    review: '课程内容比较基础，适合初学者入门。老师讲课比较认真，但语速稍快。实验环节时间略短，有些操作没有完全掌握。希望以后能增加一些进阶内容，例如如何提高微囊的包封率、如何控制微囊的粒径等等。',
    user: {
      avatar: '',
      name: '王刚',
      rate: 3,
      date: '2024年10月24日',
    },
  },
]

const faqs = [
  {
    title: 'Lorem ipsum dolor sit amet?',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!',
  },
  {
    title: 'Lorem ipsum dolor sit amet?',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!',
  },
  {
    title: 'Lorem ipsum dolor sit amet?',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!',
  },
]

const licenses = [
  {
    title: 'Overview',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!',
    list: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      'Lorem ipsum dolor sit amet elit.',
    ],
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    list: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      'Lorem ipsum dolor sit amet elit.',
    ],
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    list: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      'Lorem ipsum dolor sit amet elit.',
    ],
  },
]

const playSimulation = () => {
  dialog.value = true
}

const playVideo = () => {
  const myGallery = GLightbox({
    plyr: { css: '/glightbox/plyr.css', js: '/glightbox/plyr.js', },
    elements: [{ 'href': 'https://yigee-file.oss-cn-beijing.aliyuncs.com/video/297ebe0e-7a754b44-017a-7ab20924-0221.mp4', 'type': 'video', }],
  });
  myGallery.open();
}

const handleSimulationMessage = (event) => {
  if (event && event.data && 'object' == typeof event.data) {
    item.value.result = event.data
    dialogResult.value = true
    overlay.value = true
  }
}

onMounted(() => {
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
