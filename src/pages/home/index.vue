<template>
    <v-container max-width="1600px">
        <v-carousel height="500" show-arrows="hover" cycle hide-delimiter-background>
            <v-carousel-item v-for="(slide, i) in slides" :key="i">
                <v-img width="100%" class="position-absolute bg" cover :src="slide"></v-img>
                <v-img width="auto" height="100%" class="ma-auto" :src="slide"></v-img>
            </v-carousel-item>
        </v-carousel>
        <v-row class="pt-4">
            <v-col cols="7">
                <v-sheet class="d-flex justify-space-between align-center border-b-md px-4 py-2">
                    <span>学术报告</span>
                    <v-btn variant="text">更多 +</v-btn>
                </v-sheet>
                <v-list lines="three">
                    <v-list-item v-for="(item, index) in items" :key="index" class="border-b-sm">
                        <template #prepend>
                            <v-sheet class="d-flex flex-column border text-center mr-4" style="border-color: #990000;">
                                <div class="px-4 py-1" style=" background: #990000;"> {{ date.getDate(new Date()) }} </div>
                                <div class="px-4 py-1"> {{ date.format(new Date(), 'monthShort') }}</div>
                            </v-sheet>
                        </template>
                        <template #title>
                            {{ item.title }}
                        </template>
                        <template #default>
                            <v-list lines="one" class="text-caption opacity-70 pb-0">
                                <v-list-item class="pa-0" min-height="30px">
                                    <v-icon icon="mdi-clock-time-five" class="mr-2"></v-icon>
                                    时间：2024-11-18 15:10-17:00
                                </v-list-item>
                                <v-list-item class="pa-0" min-height="30px">
                                    <v-icon icon="mdi-account" class="mr-2"></v-icon>
                                    报告人: 黄红（北京师范大学）
                                </v-list-item>
                            </v-list>
                        </template>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="5">
                <v-list lines="two">
                    <v-list-item v-for="n in 3" :key="n" :title="'Item ' + n"
                        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"></v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDate } from 'vuetify'

const date = useDate()

const slides = ref([
    'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
    'https://cdn.vuetifyjs.com/images/cards/hotel.jpg',
    'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'
])

const items = ref([{
    title: 'Geometry and Topology Seminar——The topology of manifolds with positive isotropic curvature'
}, {
    title: 'Geometry and Topology Seminar——The topology of manifolds with positive isotropic curvature'
}, {
    title: 'Geometry and Topology Seminar——The topology of manifolds with positive isotropic curvature'
}, {
    title: 'Geometry and Topology Seminar——The topology of manifolds with positive isotropic curvature'
}

])

</script>

<style scoped>
.bg {
    filter: blur(10px);
}
</style>