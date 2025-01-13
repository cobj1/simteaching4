<template>
  <div>
    <ckeditor v-model="item.content" :editor="editor" :config="editorConfig" :disabled="completed" />
  </div>
</template>

<script setup>
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import { reactive, ref } from 'vue';

const item = defineModel()

defineProps({
  completed: { type: Boolean, default: false }
})

const editor = ref(ClassicEditor)
const editorConfig = reactive({
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
})
</script>

<style lang="scss" scoped></style>
