<template>
  <div class="border pa-4" ref="simulationRef">
    <v-responsive :aspect-ratio="16 / 9" class="w-100 h-100" min-height="300px"
      :style="angle && $vuetify.display.smAndDown ? { 'position': 'fixed', 'top': 0, 'left': 0, 'z-index': '910' } : null">
      <iframe :src="useFileUri(item.url)" class="w-100 h-100 border-0	" style="overflow: hidden;">
      </iframe>
    </v-responsive>
    <div class="pa-2 text-center" v-if="!$vuetify.display.smAndDown">
      <v-btn variant="text" prepend-icon="mdi-fullscreen" @click="enter()">全屏模式</v-btn>
    </div>
  </div>
</template>

<script setup>
import { useFileUri } from '@/utils/simulation-uri';
import { useFullscreen, useScreenOrientation } from '@vueuse/core';
import { ref } from 'vue';

const item = defineModel()

defineProps({
  completed: { type: Boolean, default: false }
})

const simulationRef = ref(null)

const { enter } = useFullscreen(simulationRef)
const { angle } = useScreenOrientation()

</script>

<style lang="scss" scoped></style>
