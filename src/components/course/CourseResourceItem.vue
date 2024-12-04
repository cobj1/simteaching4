<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card class="mb-2 mx-2" ariant="text" style="box-shadow:none;" :class="{ 'elevation-4': isHovering }"
        v-bind="props">
        <template #default>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title disable-icon-rotate>
                <v-icon v-if="item.resourceType == 'resource'" icon="mdi-book-outline" size="30" class="mr-2" />
                <v-icon v-if="item.resourceType == 'simulation'" icon="mdi-test-tube" size="30" class="mr-2" />
                <v-icon v-if="item.resourceType == 'questions'" icon="mdi-head-question-outline" size="30"
                  class="mr-2" />
                <v-icon v-if="item.resourceType == 'testpaper'" icon="mdi-ab-testing" size="30" class="mr-2" />
                {{ item.name }}
                <template v-slot:actions v-if="manage">
                  <CourseResourceItemOptions @deleted="emit('deleted')"></CourseResourceItemOptions>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-if="item.resourceType == 'resource'">
                  <v-btn :href="FileApi.filePath + item.url" target="_blank">查看资源</v-btn>
                </div>
                <div v-if="item.resourceType == 'simulation'">
                  <v-btn :href="FileApi.filePath + item.url" target="_blank">打开实验</v-btn>
                </div>
                <div v-if="item.resourceType == 'questions'">
                  <QuestionsOptions disabled :type="item.type" :options="item.options.map(item => item.name)"
                    :answer="item.answer?.split(',')">
                  </QuestionsOptions>
                </div>
                <div v-if="item.resourceType == 'testpaper'">
                  <v-list>
                    <v-list-item v-for="question in item.questions" :key="question.id" :title="question.name"
                      :subtitle="question.type"></v-list-item>
                  </v-list>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup>
import { FileApi } from '@/api/file'

const props = defineProps({
  item: Object,
  manage: Boolean
})
const emit = defineEmits(['deleted'])
</script>

<style lang="scss" scoped></style>
