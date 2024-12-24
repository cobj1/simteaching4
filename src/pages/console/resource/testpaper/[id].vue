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
                    <QuestionsOptions :type="item.type" :answer="item.answer" :options="item.options" disabled>
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

const handelSelectionQuestionsConfirm = async (qids, scores) => {
  const list = await ResourceQuestionsApi.listByIds(qids.join(','))
  qids.forEach((qid, index) => {
    const question = list.find(item => item.id == qid)
    console.log(question)
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
  await ResourceTestpaperApi.save(item.value)
  await ResourceTestpaperApi.saveQuestions({
    pid: item.value.id,
    score: totalScore.value,
    questions: items.value
  })
  router.push('/console/resource/testpaper')
}

const loadItem = async () => {
  item.value = await ResourceTestpaperApi.info(route.params.id)
}

const loadQuestions = async () => {
  const paperQuestions = await ResourceTestpaperApi.paperQuestionListByParerId(route.params.id)
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
