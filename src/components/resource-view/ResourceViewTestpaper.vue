<template>
  <v-card class="pa-4 ma-1 mb-4" v-for="(question, index) in item.questions" :key="index">
    <div class="mb-2">
      {{ question.name }}
      <span class="text-caption	text-medium-emphasis float-right">{{ question.score }} 分</span>
    </div>

    <ResourceViewQuestionAttachment :attachment="question.attachment"></ResourceViewQuestionAttachment>

    <ResourceViewSimulation v-if="question.type == '仿真题'" v-model="question.simulation"></ResourceViewSimulation>

    <QuestionsOptions v-else :type="question.type" v-model:answer="question.answer" v-model:options="question.options"
      :disabled="completed">
    </QuestionsOptions>

    <section v-if="completed">
      <h3 class="text-subtitle-1 font-weight-bold my-2">
        试题解析:
      </h3>

      <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
        {{ item.answerAnalysis ? item.answerAnalysis : '暂无解析' }}
      </div>
    </section>
  </v-card>
</template>

<script setup>
import ResourceViewQuestionAttachment from './ResourceViewQuestionAttachment.vue';

const item = defineModel()

defineProps({
  completed: { type: Boolean, default: false }
})

</script>

<style lang="scss" scoped></style>
