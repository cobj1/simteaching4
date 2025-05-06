<template>
  <v-container fluid max-width="1000px" min-height="800px">
    <VueDraggable ref="el" v-model="list" :animation="150" class="mt-8 vue-draggable pb-4" group="Resources"
      :disabled="!manage" @end="handleVueDraggableEnd">
      <div v-for="item in list" :key="item.id">
        <CourseHomeworkItem :item="item"></CourseHomeworkItem>
      </div>
    </VueDraggable>
  </v-container>
</template>

<script setup>
  import {
    VueDraggable
  } from 'vue-draggable-plus'
  import {
    onMounted,
    ref,
    watch
  } from 'vue';
  import {
    useRoute
  } from 'vue-router';
  import {
    HomeworkLogApi
  } from '@/api/homework/homework-log';
  import {
    HomeworkApi
  } from '@/api/homework/homework';
  import {
    useAnswerFormat
  } from '@/utils/answer-format';
  import {
    useIconsAdapter
  } from '@/utils/icons-adapter';

  defineProps({
    manage: Boolean
  })
  const route = useRoute()
  const list = ref([])
  const log = ref()
  const el = ref()
  const loading = ref(true)

  watch(() => route.params.id, () => loadItems())

  const handleCourseResourceItemDeleted = async (id) => {
    await HomeworkLogApi.del(id)
    loadItems()
  }

  const handleSelectionHomeworkConfirm = (value) => {

  }

  const handleVueDraggableEnd = async (event) => {

  }

  const homeworkkSave = async (array) => {

    loadItems()
  }

  const loadItems = async () => {
    loading.value = true
    console.log(route.params.id);
    const logs = await HomeworkLogApi.logList(route.params.id)
    const res = await HomeworkApi.list(route.params.id)
    res.forEach(item => {
      item.log = logs.find(log => log.hid == item.id) ? logs.find(log => log.hid == item.id) : null
    })
    list.value = res
    console.log(list.value);
    loading.value = false
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
