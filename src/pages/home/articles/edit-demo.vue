<template>
  <div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" />
  </div>
</template>

<script setup lang="ts">
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { ref, reactive } from 'vue';

const editor = ref(ClassicEditor)
const editorData = ref('<p>Hello from CKEditor 5 in Vue!</p>')
const editorConfig = reactive({
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
})
</script>

<style scoped></style>
