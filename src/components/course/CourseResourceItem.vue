<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card class="mb-2 mx-2" ariant="text" style="box-shadow:none;" :class="{ 'elevation-4': isHovering }"
        v-bind="props">
        <template #default>
          <v-expansion-panels v-if="manage">
            <v-expansion-panel>
              <v-expansion-panel-title disable-icon-rotate>
                <v-icon v-if="item.resource.resourceType == 'resource'" icon="mdi-book-outline" size="30"
                  class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'simulation'" icon="mdi-test-tube" size="30" class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'questions'" icon="mdi-head-question-outline" size="30"
                  class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'testpaper'" icon="mdi-ab-testing" size="30" class="mr-2" />
                {{ item.resource.name }}
                <template v-slot:actions>
                  <v-text-field label="分数" v-model="score" type="number" variant="underlined" hide-details
                    density="compact" :min="1" :max="100" :disabled="item.resource.resourceType == 'testpaper'"
                    v-if="['questions', 'testpaper', 'simulation'].includes(item.resource.resourceType)" @click.stop
                    @change="onChangeScore"></v-text-field>
                  <CourseResourceItemOptions @deleted="emit('deleted')"></CourseResourceItemOptions>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-if="item.resource.resourceType == 'resource'">
                  <v-btn :href="FileApi.filePath + item.resource.url" target="_blank">查看资源</v-btn>
                </div>
                <div v-if="item.resource.resourceType == 'simulation'">
                  <v-btn
                    :href="item.resource.url.includes('http') ? item.resource.url : FileApi.filePath + item.resource.url"
                    target="_blank">打开实验</v-btn>
                </div>
                <div v-if="item.resource.resourceType == 'questions'">
                  <QuestionsOptions disabled :type="item.resource.type"
                    :options="item.resource.options.map(item => item.name)" :answer="item.resource.answer?.split(',')">
                  </QuestionsOptions>
                </div>
                <div v-if="item.resource.resourceType == 'testpaper'">
                  <v-list>
                    <v-list-item v-for="question in item.resource.questions" :key="question.id" :title="question.name"
                      :subtitle="question.type"></v-list-item>
                  </v-list>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-list-item v-else class="px-6 py-4" :to="`/console/course/${route.params.id}/${item.id}`">
            <VListItemTitle class="d-flex justify-space-between align-center">
              <div>
                <v-icon v-if="item.resource.resourceType == 'resource'" icon="mdi-book-outline" size="30"
                  class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'simulation'" icon="mdi-test-tube" size="30" class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'questions'" icon="mdi-head-question-outline" size="30"
                  class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'testpaper'" icon="mdi-ab-testing" size="30" class="mr-2" />
                {{ item.resource.name }}
              </div>
              <span class="text-caption text-medium-emphasis">
                <v-chip prepend-icon="mdi-check-decagram-outline" v-if="item.log && item.log.id" class="mr-2">
                  已提交
                </v-chip>
                发布时间: {{ useDateFormat(item.createTime, 'YYYY-MM-DD') }}
              </span>
            </VListItemTitle>
          </v-list-item>
        </template>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup>
import { CourseResourceApi } from '@/api/course/course-resource';
import { FileApi } from '@/api/file'
import { useDateFormat } from '@vueuse/core';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps({
  item: Object,
  manage: Boolean
})
const emit = defineEmits(['deleted'])
const score = ref(props.item.score)

const onChangeScore = () => {
  CourseResourceApi.updateScore(props.item.id, score.value)
}

</script>

<style lang="scss" scoped></style>
