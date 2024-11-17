<template>
    <v-container>
        <v-row>
            <v-col cols="4" lg="3" xl="2" v-if="$vuetify.display.mdAndUp">
                <v-sheet rounded="lg">
                    <v-list rounded="lg">
                        <v-list-item v-for="link in links" :key="link" :title="link" link></v-list-item>

                        <v-divider class="my-2"></v-divider>

                        <v-list-item color="grey-lighten-4" title="刷新" link></v-list-item>
                    </v-list>
                </v-sheet>
            </v-col>

            <v-col>
                <v-sheet min-height="70vh" rounded="lg">
                    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" />
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
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

const links = [
  '家长生涯人物进课堂活动',
  '我校举办学生发展指导专题讲座',
  '选课走班学习 促进学生多元化发展',
  '自主命题，首先考的是考官'
]
</script>

<style scoped></style>