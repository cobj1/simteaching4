<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer v-model="drawer" color="primary" disable-resize-watcher>
      <v-list nav>
        <v-list-item v-for="(item, i) in items" :key="i" :active="i === 0" link :title="item.text" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="px-md-4">
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />
        <v-img class="me-sm-8" max-width="40" src="https://cdn.vuetifyjs.com/docs/images/logos/v.svg" />
        <div v-if="$vuetify.display.mdAndUp">
          <v-btn v-for="(item, i) in items" :key="i" :active="i === 0" variant="text" slim v-bind="item"></v-btn>
        </div>
        <v-spacer></v-spacer>
        <ThemeSwitch></ThemeSwitch>
        <v-btn class="ms-1" icon>
          <v-avatar image="https://cdn.vuetifyjs.com/images/john.png" />
          <v-menu activator="parent" origin="top">
            <v-list>
              <v-list-item link title="Update profile" />
              <v-list-item link title="Sign out" />
            </v-list>
          </v-menu>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center">
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
    </v-main>
  </v-layout>
</template>

<script setup>
import { shallowRef } from 'vue'
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { ref } from 'vue';
import { reactive } from 'vue';

const drawer = shallowRef(false)
const editor = ref(ClassicEditor)
const editorData = ref('<p>Hello from CKEditor 5 in Vue!</p>')
const editorConfig = reactive({
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
})

const items = [
  {
    text: '首页',
  },
  {
    text: '学校概况',
  },
  {
    text: '学校新闻',
  },
  {
    text: '德育天地',
  }
]

const links = [
  '家长生涯人物进课堂活动',
  '我校举办学生发展指导专题讲座',
  '选课走班学习 促进学生多元化发展',
  '自主命题，首先考的是考官'
]
</script>
 

<style>

</style>