<template>
  <v-container max-width="1600px">
    <v-row>
      <v-col cols="4" lg="3" xl="2" v-if="$vuetify.display.mdAndUp">
      </v-col>
      <v-col class="pa-0">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
      </v-col>
    </v-row>
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
          <router-view></router-view>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">


const links = [
  '家长生涯人物进课堂活动',
  '我校举办学生发展指导专题讲座',
  '选课走班学习 促进学生多元化发展',
  '自主命题，首先考的是考官'
]

const breadcrumbs = [
  {
    title: '首页',
    disabled: false,
    href: '/home',
  },
  {
    title: '家长生涯人物进课堂活动',
    disabled: true,
  },
]
</script>

<style scoped></style>
