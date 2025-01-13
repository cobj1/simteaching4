<template>
  <v-avatar class="pa-7" color="surface-light" rounded="lg" :size="size">
    <v-avatar :color="configs[type].color" :icon="configs[type].icon" rounded>
      <v-icon color="white" />
    </v-avatar>
  </v-avatar>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 50
  },
  type: {
    type: String
  },
})
const configs = {
  // 课程资源
  resource: {
    color: 'blue',
    icon: 'mdi-book-outline'
  },
  simulation: {
    color: 'deep-purple',
    icon: 'mdi-test-tube'
  },
  questions: {
    color: 'teal',
    icon: 'mdi-head-question-outline'
  },
  testpaper: {
    color: 'cyan',
    icon: 'mdi-ab-testing'
  },
  report_template: {
    color: 'red',
    icon: 'mdi-file-word-box-outline'
  },
  // 文件资源
  excel: {
    color: 'info',
    icon: 'mdi-text-long',
  },
  code: {
    color: 'info',
    icon: 'mdi-text',
  },
  folder: {
    color: 'success',
    icon: 'mdi-pencil-ruler',
  },
  misc: {
    color: 'amber',
    icon: 'mdi-rectangle-outline',
  },
  pdf: {
    color: 'amber',
    icon: 'mdi-note-multiple-outline',
  },
  ppt: {
    color: 'info',
    icon: 'mdi-text',
  },
  text: {
    color: 'info',
    icon: 'mdi-text',
  },
  video: {
    color: 'info',
    icon: 'mdi-text',
  },
  word: {
    color: 'info',
    icon: 'mdi-text',
  },
  wp: {
    color: 'info',
    icon: 'mdi-text',
  },
  zip: {
    color: 'info',
    icon: 'mdi-text',
  },
  picture: {
    color: 'info',
    icon: 'mdi-text',
  },
}

</script>

<style lang="scss" scoped></style>
