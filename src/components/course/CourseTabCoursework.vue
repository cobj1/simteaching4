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
          @click="CourseSubjectEditRef.editItem(route.params.id, subjects.length)"></v-list-item>
      </v-list>
    </v-menu>
    <VueDraggable ref="el" v-model="list" :animation="150" class="mt-8 vue-draggable pb-4" group="Resources"
      @end="handleVueDraggableEnd">
      <div v-for="item in list" :key="item.id">
        <CourseResourceItem :item="item.resource" @deleted="handleCourseResourceItemDeleted(item.id)">
        </CourseResourceItem>
      </div>
    </VueDraggable>
    <v-card v-for="subitem in subjects" :key="subitem.id" style="box-shadow:none;">
      <template #title>
        <div class="text-h4 pl-4">{{ subitem.name }}</div>
      </template>
      <template #append>
        <div class="mr-4">
          <CourseSubjectOptions :item="subitem" @change="loadItems"
            @rename="CourseSubjectEditRef.editItem(route.params.id, subjects.length, subitem)">
          </CourseSubjectOptions>
        </div>
      </template>
      <VDivider class="py-2"></VDivider>
      <v-card-text class="pa-0">
        <VueDraggable ref="el" v-model="subitem.children" :animation="150" class="vue-draggable pb-4" group="Resources"
          @end="handleVueDraggableEnd">
          <div v-for="item in subitem.children" :key="item.id">
            <CourseResourceItem :item="item.resource" @deleted="handleCourseResourceItemDeleted(item.id)">
            </CourseResourceItem>
          </div>
        </VueDraggable>
      </v-card-text>
    </v-card>
    <v-empty-state v-if="list.length == 0 && subjects.length == 0">
      <template #media>
        <VDivider class="py-2"></VDivider>
        <v-img class="my-8" src="@/assets/svg/empty-dog.svg" height="200px"></v-img>
      </template>
      <template v-slot:title>
        <div class="text-subtitle-2 mt-8">
          您将在此处布置作业
        </div>
      </template>
      <template v-slot:text>
        <div class="text-caption">
          您可以为课程增加作业，然后按主题整理。
        </div>
      </template>
    </v-empty-state>
    <CourseSubjectEdit ref="CourseSubjectEditRef" @change="loadItems"></CourseSubjectEdit>
  </v-container>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'
import SelectionCourseware from '@/components/resource/SelectionCourseware.vue';
import SelectionTestpaper from '@/components/resource/SelectionTestpaper.vue';
import SelectionQuestions from '@/components/resource/SelectionQuestions.vue';
import SelectionSimulation from '@/components/resource/SelectionSimulation.vue';
import { onMounted, ref, watch } from 'vue';
import { CourseResourceApi } from '@/api/course-resource';
import { CourseSubjectApi } from '@/api/course/course-subject';
import { useRoute } from 'vue-router';

const route = useRoute()
const list = ref([])
const subjects = ref([])
const el = ref()
const CourseSubjectEditRef = ref()

watch(() => route.params.id, () => {
  loadItems()
})

const handleCourseResourceItemDeleted = async (id) => {
  await CourseResourceApi.del(id)
  loadItems()
}

const handleSelectionCoursewareConfirm = (value) => {
  courseworkSave(JSON.stringify(value.map((item, index) => {
    return { cid: route.params.id, type: 'resource', rid: item, order: list.value.length + index }
  })))
}
const handleSelectionSimulationConfirm = (value) => {
  courseworkSave(JSON.stringify(value.map((item, index) => {
    return { cid: route.params.id, type: 'simulation', rid: item, order: list.value.length + index }
  })))
}
const handleSelectionQuestionsConfirm = (value) => {
  courseworkSave(JSON.stringify(value.map((item, index) => {
    return { cid: route.params.id, type: 'questions', rid: item, order: list.value.length + index }
  })))
}
const handleSelectionTestpaperConfirm = (value) => {
  courseworkSave(JSON.stringify(value.map((item, index) => {
    return { cid: route.params.id, type: 'testpaper', rid: item, order: list.value.length + index }
  })))
}
const handleVueDraggableEnd = async (event) => {
  if (event.newIndex != event.oldIndex) {
    const newList = []
    newList.push(...list.value)
    subjects.value.forEach(subject => newList.push(...subject.children.map(item => { return { ...item, sid: subject.id } })))
    await CourseResourceApi.save(newList.map(item => {
      return { cid: item.cid, rid: item.rid, sid: item.sid, type: item.type }
    }), true, route.params.id)
  }
}

const courseworkSave = async (array) => {
  await CourseResourceApi.save(array)
  loadItems()
}

const loadItems = async () => {
  const res = await CourseResourceApi.list(route.params.id)
  subjects.value = (await CourseSubjectApi.list(route.params.id)).map(subject => { return { ...subject, children: res.filter(item => item.sid == subject.id) || [] } })
  list.value = res.filter(item => !item.sid)
}

onMounted(() => {
  loadItems()
})
</script>

<style lang="scss" scoped>
.vue-draggable:deep(.sortable-ghost .v-card) {
  box-shadow: 0px 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 3px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12)) !important;
}
</style>
