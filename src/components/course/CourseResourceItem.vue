<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card class="mb-2 mx-2" ariant="text" style="box-shadow:none;" :class="{ 'elevation-4': isHovering }"
        v-bind="props">
        <template #default>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title disable-icon-rotate>
                <v-icon v-if="item.resource.resourceType == 'resource'" icon="mdi-book-outline" size="30"
                  class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'simulation'" icon="mdi-test-tube" size="30" class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'questions'" icon="mdi-head-question-outline" size="30"
                  class="mr-2" />
                <v-icon v-if="item.resource.resourceType == 'testpaper'" icon="mdi-ab-testing" size="30" class="mr-2" />
                {{ item.resource.name }}
                <template v-slot:actions v-if="manage">
                  <v-text-field label="分数" v-model="score" type="number" variant="underlined" hide-details
                    density="compact" :min="1" :max="100" @click.stop @change="onChangeScore"></v-text-field>
                  <CourseResourceItemOptions @deleted="emit('deleted')"></CourseResourceItemOptions>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text v-if="manage">
                <div v-if="item.resource.resourceType == 'resource'">
                  <v-btn :href="FileApi.filePath + item.resource.url" target="_blank">查看资源</v-btn>
                </div>
                <div v-if="item.resource.resourceType == 'simulation'">
                  <v-btn :href="FileApi.filePath + item.resource.url" target="_blank">打开实验</v-btn>
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
              <v-expansion-panel-text v-else>
                <div>
                  <v-btn @click="goResource">查看</v-btn>
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
import { CourseResourceApi } from '@/api/course/course-resource';
import { FileApi } from '@/api/file'
import { ref } from 'vue';

const props = defineProps({
  item: Object,
  manage: Boolean
})
const emit = defineEmits(['deleted'])
const score = ref(props.item.score)

const onChangeScore = () => {
  CourseResourceApi.updateCourseResourceScore(props.item.id, score.value)
}

const goResource = () => {
  console.log(props.item)
}

</script>

<style lang="scss" scoped></style>
