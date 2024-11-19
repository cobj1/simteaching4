<template>
  <v-container max-width="1600px">
    <v-carousel height="400" show-arrows="hover" hide-delimiter-background>
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-img width="100%" class="position-absolute bg" cover :src="slide" style="transform: scale(1.1);"></v-img>
        <v-img width="auto" height="100%" class="ma-auto" :src="slide"></v-img>
      </v-carousel-item>
    </v-carousel>
    <v-row class="pt-4">
      <v-col md="7" cols="12">
        <v-sheet class="d-flex justify-space-between align-center border-b-md px-4 py-2">
          <span>学术报告</span>
          <v-btn variant="text">更多 +</v-btn>
        </v-sheet>
        <v-list lines="three">
          <v-list-item class="border-b-sm" v-for="(item, index) in acadeamic" :key="index" :value="index"
            @click="router.push(`/home/articles/${index}`)">
            <template #prepend>
              <v-sheet class="d-flex flex-column border text-center mr-4" style="border-color: #990000;">
                <div class="px-4 py-1" style=" background: #990000; color: white;">
                  {{ date.getDate(new Date()) }}
                </div>
                <div class="px-4 py-1"> {{ date.format(new Date(), 'monthShort') }}</div>
              </v-sheet>
            </template>
            <template #title>
              {{ item.title }}
            </template>
            <template #default>
              <div class="text-caption opacity-70 mt-1 d-flex flex-column ga-1 py-1">
                <div class="pa-0">
                  <v-icon icon="mdi-clock-time-five" class="mr-2"></v-icon>
                  时间：{{ item.date }}
                </div>
                <div class="pa-0">
                  <v-icon icon="mdi-account" class="mr-2"></v-icon>
                  报告人: {{ item.author }}
                </div>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col md="5" cols="12">
        <v-sheet class="d-flex justify-space-between align-center border-b-md px-4 py-2">
          <span>学校新闻</span>
          <v-btn variant="text">更多 +</v-btn>
        </v-sheet>
        <v-list lines="two">
          <v-list-item class="border-b-sm" v-for="(item, index) in news" :key="index" :title="item.title" :value="index"
            @click="router.push(`/home/articles/${index}`)">
            <div class="text-caption opacity-70 pb-0 d-flex pt-1">
              <v-icon icon="mdi-clock-time-five" class="mr-2"></v-icon>
              时间：{{ item.date }}
            </div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDate } from 'vuetify'

const date = useDate()
const router = useRouter()

const slides = ref([
  'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
  'https://cdn.vuetifyjs.com/images/cards/hotel.jpg',
  'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'
])

const acadeamic = ref([
  {
    title: 'Geometry and Topology Seminar——The topology of manifolds with positive isotropic curvature',
    date: '2024-11-18 14:00-15:00',
    author: 'Runze Li,（Pennsylvania State University)'
  },
  {
    title: 'Model-Free Statistical Inference on High-Dimensional Data',
    date: '2024-11-18 14:00-15:00',
    author: 'Runze Li,（Pennsylvania State University)'
  },
  {
    title: 'The Habiro ring of a number field （I）',
    date: '2024-11-18 14:00-15:00',
    author: 'Runze Li,（Pennsylvania State University)'
  },
  {
    title: 'The Habiro ring of a number field （II）',
    date: '2024-11-18 14:00-15:00',
    author: 'Runze Li,（Pennsylvania State University)'
  },
  {
    title: '应用数学青年讨论班（午餐会）——Parallel Coordinate Descent Methods for Full Configuration Interaction',
    date: '2024-11-18 14:00-15:00',
    author: 'Runze Li,（Pennsylvania State University)'
  }
])

const news = ref([
  {
    title: '祝贺！北大数院教师章志飞教授获中国数学会陈省身数学奖',
    date: '2024-11-18',
  },
  {
    title: '祝贺！北大数院教师章志飞教授获中国数学会陈省身数学奖',
    date: '2024-11-18',
  },
  {
    title: '祝贺！北大数院教师章志飞教授获中国数学会陈省身数学奖',
    date: '2024-11-18',
  },
  {
    title: '江泽涵、程民德先生雕像揭幕仪式暨北京大学数学科学学院离退休教职工交流座谈会顺利举行',
    date: '2024-11-18',
  },
  {
    title: '“科学巨星·大师风范——纪念北大著名校友潘承洞先生诞辰90周年专题展”开幕',
    date: '2024-11-18',
  },
  {
    title: '载一抱素，数可无穷——北京大学第二十七届数学文化节开幕',
    date: '2024-11-18',
  },
  {
    title: '数学科学学院2024年开学典礼顺利举行',
    date: '2024-11-18',
  },
  {
    title: '迎新｜北大数院喜迎2024级研究生新生',
    date: '2024-11-18',
  }
])

</script>

<style scoped>
.bg {
  filter: blur(10px);
}
</style>
