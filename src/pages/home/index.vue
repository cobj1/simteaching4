<template>
  <v-container max-width="1600px">
    <v-carousel v-model="carouselIndex" height="400" show-arrows="hover" cycle hide-delimiter-background>
      <v-carousel-item v-for="(slide) in slides" :key="slide.id">
        <v-img width="100%" class="position-absolute bg" cover :src="slide.url" style="transform: scale(1.1);"></v-img>
        <v-img width="auto" height="100%" class="ma-auto" :src="slide.url"></v-img>
      </v-carousel-item>
    </v-carousel>
    <v-row class="pt-4">
      <v-col md="7" cols="12">
        <v-sheet class="d-flex justify-space-between align-center border-b-md px-4 py-2">
          <span>{{ homeStore.TypeItems[0]?.type }}</span>
          <v-btn variant="text" @click="router.push('/home/articles')">更多 +</v-btn>
        </v-sheet>
        <v-list lines="three" min-height="500px">
          <v-list-item class="border-b-sm" v-for="(item, index) in acadeamic" :key="index" :value="index"
            @click="router.push(`/home/articles/${item.id}`)">
            <template #prepend>
              <v-sheet class="d-flex flex-column border text-center mr-4" style="border-color: #990000;">
                <div class="px-4 py-1" style=" background: #990000; color: white;">
                  {{ date.getDate(new Date(item.createTime)) }}
                </div>
                <div class="px-4 py-1"> {{ date.format(item.createTime || new Date(), 'monthShort') }}</div>
              </v-sheet>
            </template>
            <template #title>
              {{ item.title }}
            </template>
            <template #default>
              <div class="text-caption opacity-70 mt-1 d-flex flex-column ga-1 py-1">
                <div class="pa-0">
                  <v-icon icon="mdi-clock-time-five" class="mr-2"></v-icon>
                  时间：{{ item.createTime }}
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
          <span>{{ homeStore.TypeItems[0]?.type }}</span>
          <v-btn variant="text" @click="router.push('/home/news')">更多 +</v-btn>
        </v-sheet>
        <v-list lines="two" min-height="500px">
          <v-list-item class="border-b-sm" v-for="(item, index) in news" :key="index" :title="item.title" :value="index"
            @click="router.push(`/home/news/${item.id}`)">
            <div class="text-caption opacity-70 pb-0 d-flex pt-1">
              <v-icon icon="mdi-clock-time-five" class="mr-2"></v-icon>
              时间：{{ item.createTime }}
            </div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { SiteApi } from '@/api/site';
import { useHomeStore } from '@/stores/home';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDate } from 'vuetify'

const date = useDate()
const router = useRouter()
const homeStore = useHomeStore()
const slides = ref([])
const acadeamic = ref([])
const news = ref([])
const loading = ref(true)
const carouselIndex = ref(0)

const loadItems = async () => {
  loading.value = true
  if (homeStore.TypeItems.length > 0) {
    const res = await SiteApi.page({ current: 1, size: homeStore.TypeItems[0].displays, typeId: homeStore.TypeItems[0].id })
    acadeamic.value = res.records
    const res2 = await SiteApi.page({ current: 1, size: homeStore.TypeItems[1].displays, typeId: homeStore.TypeItems[1].id })
    news.value = res2.records
  } else {
    const res = await SiteApi.page({ current: 1, size: 5, typeId: '1' })
    acadeamic.value = res.records
    const res2 = await SiteApi.page({ current: 1, size: 8, typeId: '2' })
    news.value = res2.records
  }
  loading.value = false
}
const loadCarousel = async () => {
  slides.value = await SiteApi.carouselList()
}

onMounted(async () => {
  await homeStore.loadNavigationItems()
  loadItems()
  loadCarousel()
})
</script>

<style scoped>
.bg {
  filter: blur(10px);
}
</style>
