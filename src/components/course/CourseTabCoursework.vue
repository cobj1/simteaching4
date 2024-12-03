<template>
  <v-container fluid max-width="1000px" min-height="800px">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn prepend-icon="mdi-plus" rounded="xl" size="large" color="#5865f2" v-bind="props">创建</v-btn>
      </template>
      <v-list class="mt-2" width="160">
        <v-list-item title="资料" prepend-icon="mdi-book-outline" link>
          <SelectionCourseware @confirm="handleSelectionCoursewareConfirm"></SelectionCourseware>
        </v-list-item>
        <v-list-item title="仿真" prepend-icon="mdi-test-tube" link>
          <SelectionSimulation @confirm="handleSelectionSimulationConfirm"></SelectionSimulation>
        </v-list-item>
        <v-list-item title="题目" prepend-icon="mdi-head-question-outline" link>
          <SelectionQuestions @confirm="handleSelectionQuestionsConfirm"></SelectionQuestions>
        </v-list-item>
        <v-list-item title="测试" prepend-icon="mdi-ab-testing" link>
          <SelectionTestpaper @confirm="handleSelectionTestpaperConfirm"></SelectionTestpaper>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item title="主题" prepend-icon="mdi-list-box-outline" link
          @click="CourseSubjectEditRef.editItem(cid, subjects.length)"></v-list-item>
      </v-list>
    </v-menu>
    <VueDraggable ref="el" v-model="list" :animation="150" class="mt-8 vue-draggable" group="Resources"
      @end="handleVueDraggableEnd">
      <div v-for="item in list" :key="item.id">
        <CourseResourceItem :item="item.resource" @deleted="handleCourseResourceItemDeleted(item.id)">
        </CourseResourceItem>
      </div>
    </VueDraggable>
    <v-card v-for="subitem in subjects" :key="subitem.id" style="box-shadow:none;">
      <template #title>
        {{ subitem.name }}
      </template>
      <template #subtitle>
        {{ subitem.explain }}
      </template>
      <template #append>
        <div class="mr-4">
          <CourseSubjectOptions :item="subitem" @change="emit('change')"
            @rename="CourseSubjectEditRef.editItem(cid, subjects.length, subitem)">
          </CourseSubjectOptions>
        </div>
      </template>
      <v-card-text class="pa-0">
        <VueDraggable ref="el" v-model="subitem.children" :animation="150" class="vue-draggable" group="Resources"
          @end="handleVueDraggableEnd">
          <div v-for="item in subitem.children" :key="item.id">
            <CourseResourceItem :item="item.resource" @deleted="handleCourseResourceItemDeleted(item.id)">
            </CourseResourceItem>
          </div>
        </VueDraggable>
      </v-card-text>
    </v-card>
    <CourseSubjectEdit ref="CourseSubjectEditRef" @change="emit('change')"></CourseSubjectEdit>
  </v-container>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'
import SelectionCourseware from '@/components/resource/SelectionCourseware.vue';
import SelectionTestpaper from '@/components/resource/SelectionTestpaper.vue';
import SelectionQuestions from '@/components/resource/SelectionQuestions.vue';
import SelectionSimulation from '@/components/resource/SelectionSimulation.vue';
import { ref } from 'vue';

const list = defineModel('list')
const subjects = defineModel('subjects')
const emit = defineEmits(['change', 'changeOrder', 'save', 'del'])
const props = defineProps(['cid'])
const el = ref()
const CourseSubjectEditRef = ref()

const handleCourseResourceItemDeleted = (id) => {
  emit('del', id)
}

const handleSelectionCoursewareConfirm = (value) => {
  emit('save', JSON.stringify(value.map((item, index) => {
    return { cid: props.cid, type: 'resource', rid: item, order: list.value.length + index }
  })))
}
const handleSelectionSimulationConfirm = (value) => {
  emit('save', JSON.stringify(value.map((item, index) => {
    return { cid: props.cid, type: 'simulation', rid: item, order: list.value.length + index }
  })))
}
const handleSelectionQuestionsConfirm = (value) => {
  emit('save', JSON.stringify(value.map((item, index) => {
    return { cid: props.cid, type: 'questions', rid: item, order: list.value.length + index }
  })))
}
const handleSelectionTestpaperConfirm = (value) => {
  emit('save', JSON.stringify(value.map((item, index) => {
    return { cid: props.cid, type: 'testpaper', rid: item, order: list.value.length + index }
  })))
}

const handleVueDraggableEnd = (event) => {
  if (event.newIndex != event.oldIndex)
    emit('changeOrder')
}

</script>

<style lang="scss" scoped></style>
