<template>
  <div class="border pa-4">
    <div class="mb-2">
      {{ item.name }}
    </div>
    <v-responsive v-if="item.type == '仿真题'" :aspect-ratio="16 / 9" class="w-100 h-100" min-height="300px">
      <iframe :src="useFileUri(item.simulation.url)" class="w-100 h-100 border-0	" style="overflow: hidden;">
      </iframe>
    </v-responsive>
    <QuestionsOptions v-else :type="item.type" v-model:answer="item.answer" v-model:options="item.options"
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
import { useFileUri } from '@/utils/simulation-uri';

const item = defineModel()

defineProps({
  completed: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped></style>
