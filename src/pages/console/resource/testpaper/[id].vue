<template>
  <div width="500px">
    <VCard>
      <VToolbar :title="title">
        <ResourceCategory>
          <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
        </ResourceCategory>
      </VToolbar>
    </VCard>
    <div class="d-flex pt-4" :class="{ 'flex-column': $vuetify.display.smAndDown }">
      <div class="flex-1-1 text-center">
        <v-list v-model:selected="selected" mandatory max-width="1000px" class="ma-auto" bg-color="transparent"
          base-color="transparent">
          <v-list-item :value="0">
            <div class="pa-2">
              <v-alert border="start" :border-color="selected[0] == 0 ? '' : '#FFFFFF00'" elevation="2"
                style="background: rgb(var(--v-theme-surface));">
                <v-text-field v-model="item.name" label="测试标题" hide-details variant="underlined"></v-text-field>
              </v-alert>
            </div>
          </v-list-item>
          <VueDraggable v-model="items" :animation="150" handle=".handle"
            class="flex flex-col gap-2 p-4 w-300px bg-gray-500/5 rounded">
            <v-list-item v-for="(item, index) in items" :key="item.id" :value="index + 1">
              <div class="pa-2">
                <v-alert border="start" :border-color="selected[0] == index + 1 ? '' : '#FFFFFF00'" elevation="2"
                  style="background: rgb(var(--v-theme-surface));">
                  <template #title>
                    {{ item.name }}
                    <div class="opacity-70 pl-2 text-body-1">
                      ({{ item.type }})
                    </div>
                    <v-icon icon="mdi-dots-grid position-absolute top-0 overflow-hidden pt-4 px-4 handle opacity-70"
                      style="left: 50%; transform: translateX(-50%); height: 26px;"></v-icon>
                  </template>
                  <div class="pa-1">
                    <QuestionsOptions :type="item.type" :answer="item.answer" :options="item.options"
                      v-model:simulation="item.simulation" disabled>
                    </QuestionsOptions>
                    <VDivider class="my-2"></VDivider>
                    <div class="text-indigo d-flex justify-space-between">
                      <v-btn variant="text" prepend-icon="mdi-clipboard-check-outline" @click="setScoreItem(item)">
                        分数 ( {{ item.score }} )
                      </v-btn>
                      <v-btn variant="text" prepend-icon="mdi-delete-outline" @click="deleteItem(item)">
                        删除
                      </v-btn>
                    </div>
                  </div>
                </v-alert>
              </div>
            </v-list-item>
          </VueDraggable>
        </v-list>
        <v-btn prepend-icon="mdi-plus" class="my-4" color="primary" size="x-large" rounded elevation="2">
          添加试题
          <SelectionQuestions @confirm="handelSelectionQuestionsConfirm"></SelectionQuestions>
        </v-btn>
      </div>
      <VCard max-width="600px" min-width="350px">
        <v-container>
          <v-row>
            <v-col cols="12">
              类型
            </v-col>
            <v-col cols="12">
              <v-select v-model="item.category" label="类型" hide-details :items="resourceStore.categorys"
                item-title="name" item-value="id"></v-select>
            </v-col>
            <v-col cols="12">
              难易度
            </v-col>
            <v-col cols="12">
              <v-select v-model="item.difficulty" label="难易度" hide-details
                :items="testpaperStore.difficultys"></v-select>
            </v-col>
            <v-col cols="12">
              模式
            </v-col>
            <v-col cols="12">
              <v-select v-model="item.model" label="模式" hide-details :items="testpaperStore.models"></v-select>
            </v-col>
            <v-col cols="12" v-if="item.model == '随机'">
              <v-sheet class="overflow-hidden mx-auto" rounded="lg">
                <v-list lines="two" variant="flat">
                  <v-list-subheader>随机设置</v-list-subheader>

                  <div class="text-caption ps-4">
                    考试采用随机试题是现代考试发展的重要趋势，它通过技术手段有效地提高了考试的公平性、有效性和效率，有助于更好地选拔人才，促进教育教学质量的提高。尤其是在线考试系统的普及，使得随机组卷的实现更加便捷和高效。

                    <p class="text-medium-emphasis mt-4">
                      虽然随机组卷有很多优点，但也需要注意以下几点：
                    </p>
                    <v-list-item v-for="(item, i) in testpaperStore.features" :key="i" class="px-0">
                      <template #title>
                        <p class="text-body-2 font-weight-bold pb-2">
                          <v-icon class="mr-2" color="primary" :icon="item.icon" size="small" />
                          {{ item.title }}
                        </p>
                      </template>
                      <template #subtitle>
                        <p class="ps-7" style="line-height: 20px;">{{ item.subtitle }}</p>
                      </template>
                    </v-list-item>
                  </div>

                  <div class="pa-3">
                    <v-list-item v-for="(item, index) in randomSettings" :key="item.title" base-color="surface-light"
                      class="mt-2" rounded>
                      <template #prepend>
                        <v-avatar class="text-h6">{{ item.emoji }}</v-avatar>
                      </template>

                      <template #title>
                        <span class="text-subtitle-2 font-weight-bold">{{ item.type }}</span>
                      </template>

                      <template #append>
                        <v-text-field v-model="randomSettings[index].value" type="number" label="数量" hide-details
                          width="100px" variant="underlined"></v-text-field>
                      </template>
                    </v-list-item>
                  </div>
                </v-list>
              </v-sheet>
            </v-col>
            <v-col cols="12">
              总分
            </v-col>
            <v-col cols="12">
              <v-text-field :label="totalScore + ''" hide-details disabled></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn prepend-icon="mdi-content-save-check-outline" class="my-4 w-100" size="x-large" rounded
                elevation="2" @click="save">
                保存
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </VCard>
    </div>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">您确定要删除此项目吗？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">取消</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSetScore" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">设置分数</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.score" label="分数" type="number"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeSetScore">
            取消
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="setScoreItemConfirm">
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'
import { ResourceTestpaperApi } from '@/api/resource/resource-paper';
import { ResourceQuestionsApi } from '@/api/resource/resource-questions';
import { useResourceStore } from '@/stores/resource';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAnswerFormat } from '@/utils/answer-format';
import { useTestpaperStore } from '@/stores/testpaper';
import { useIconsAdapter } from '@/utils/icons-adapter';
import { useQuestionsStore } from '@/stores/questions';

const testpaperStore = useTestpaperStore()
const questionsStore = useQuestionsStore()
const resourceStore = useResourceStore()
const route = useRoute()
const router = useRouter()
const item = ref({})
const title = computed(() => route.params.id == 'add' ? '新增' : '修改')
const items = ref([])
const selected = ref([0])
const totalScore = computed(() => items.value.reduce((previousValue, currentValue) => (previousValue * 1) + (currentValue.score * 1), 0))
const dialogDelete = ref(false)
const dialogSetScore = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  score: 0,
})
const defaultItem = ref({
  id: null,
  score: 0,
})
const randomSettings = ref(
  questionsStore.types.map((type, index) => {
    return { emoji: useIconsAdapter('emoji-' + (index + 1)), type, value: 0 }
  })
)

const handelSelectionQuestionsConfirm = async (qids, scores) => {
  const list = await ResourceQuestionsApi.listByIds(qids.join(','))
  qids.forEach((qid, index) => {
    const question = list.find(item => item.id == qid)
    items.value.push({
      ...question,
      options: question.options.map(option => option.name),
      answer: useAnswerFormat(question.answer, question.type),
      score: scores ? scores[index] : 0,
    })
  })
}

const deleteItem = (item) => {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogDelete.value = true;
}

const setScoreItem = (item) => {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = Object.assign({}, item)
  dialogSetScore.value = true;
}

const closeDelete = () => {
  dialogDelete.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  })
}

const closeSetScore = () => {
  dialogSetScore.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem.value)
    editedIndex.value = -1;
  })
}

const deleteItemConfirm = async () => {
  items.value.splice(editedIndex.value, 1)
  closeDelete()
}

const setScoreItemConfirm = async () => {
  items.value[editedIndex.value].score = editedItem.value.score
  closeSetScore()
}

const save = async () => {
  await ResourceTestpaperApi.save(item.value, randomSettings.value)
  await ResourceTestpaperApi.saveQuestions({
    pid: item.value.id,
    score: totalScore.value,
    questions: items.value,
  })
  router.push('/console/resource/testpaper')
}

const loadItem = async () => {
  const res = await ResourceTestpaperApi.info(route.params.id)
  try {
    if (res.model == '随机' && res.randomSettings) {
      randomSettings.value = JSON.parse(res.randomSettings.settings).map((item, index) => {
        return { emoji: useIconsAdapter('emoji-' + (index + 1)), type: item.type, value: item.value }
      })
    }
  } catch (e) { /* empty */ }

  item.value = res
  delete item.value.randomSettings
}

const loadQuestions = async () => {
  const paperQuestions = await ResourceTestpaperApi.questionsByPid(route.params.id)
  const qids = paperQuestions.map(item => item.qid)
  const scores = paperQuestions.map(item => item.score)
  handelSelectionQuestionsConfirm(qids, scores)
}


onMounted(async () => {
  await resourceStore.loadCategorys()
  await loadItem()
  await loadQuestions()

})
</script>

<style lang="scss" scoped></style>
