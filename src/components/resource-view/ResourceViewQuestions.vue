<template>
  <div class="border pa-4">
    <div class="mb-2">
      {{ item.name }}
    </div>
    <QuestionsOptions :type="item.type" v-model:answer="item.answer" v-model:options="item.options"
      :disabled="completed">
    </QuestionsOptions>
    <section v-if="completed">
      <h3 class="text-subtitle-1 font-weight-bold mb-2">
        试题解析:
      </h3>

      <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
        {{ item.answerAnalysis ? item.answerAnalysis : '暂无解析' }}
      </div>
    </section>
  </div>
</template>

<script setup>
const item = defineModel()

defineProps({
  completed: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped></style>
