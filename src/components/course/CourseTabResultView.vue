<template>
  <v-dialog v-model="dialog" max-width="800" scrollable>
    <v-card :title="item.name">
      <template v-slot:text>
        <div v-if="item.type == 'questions'">
          <QuestionsOptions disabled :type="questions.qtype" :options="questions.options.map(item => item.name)"
            :answer="questions.answer">
          </QuestionsOptions>
        </div>
        <div v-else-if="item.type == 'testpaper'">
          <v-card class="pa-4 ma-1 mb-4" v-for="(question, index) in testpaper.questions" :key="index">
            <div class="mb-2">
              {{ question.name }}
              <span class="text-caption	text-medium-emphasis float-right">{{ question.score }} 分</span>
            </div>
            <QuestionsOptions disabled :type="question.type" v-model:answer="question.answer"
              v-model:options="question.options">
            </QuestionsOptions>
          </v-card>
        </div>
      </template>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="关闭" variant="text" @click="dialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { CourseResourceApi } from '@/api/course/course-resource';
import { ResourceApi } from '@/api/resource/resource';
import { ResourceTestpaperApi } from '@/api/resource/resource-paper';
import { ref } from 'vue';

const dialog = ref(false)

const item = ref({
  type: null,
  name: null
})
const questions = ref({
  qtype: null,
  options: [],
  answer: null,
})

const testpaper = ref({
  questions: []
})

const open = async (value) => {
  item.value.type = value.type
  if (value.type == 'questions') {
    try {
      const res = await ResourceApi.info(value.rid, value.type)
      item.value.name = res.name
      questions.value.options = res.options || []
      questions.value.qtype = res.type
    } catch (e) { /* empty */ }
    try {
      const res = await CourseResourceApi.logDataInfo(value.crlid)
      questions.value.answer = questions.value.qtype == '多选题' ? res?.split(',') : res + ''
    } catch (e) { /* empty */ }
  }
  if (value.type == "testpaper") {
    try {
      const res = await ResourceTestpaperApi.exam(value.rid)
      item.value.name = res.name
      testpaper.value.questions = res.questions
    } catch (e) { /* empty */ }
    try {
      const res = await CourseResourceApi.logDataInfo(value.crlid)
      testpaper.value.questions.forEach(question => {
        const selfAnswer = res.find(item => item.qid == question.id)
        question.answer = question.type == '多选题' ? selfAnswer.answer?.split(',') : selfAnswer.answer + ''
        question.options = question.options.map(item => item.name)
      })
    } catch (e) { /* empty */ }
  }

  dialog.value = true
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped></style>
