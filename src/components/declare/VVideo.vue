<template>
  <div>
    <v-responsive class="text-center mx-auto my-10" max-width="700">
      <p class="font-weight-bold text-h4 mb-2">引导视频</p>
      <p class="text-subtitle-1 text-medium-emphasis">
        引导视频的设计和制作也需要注意一些问题，例如视频的时长要适中，内容要精炼，画面要清晰，语言要简洁易懂等，以确保其能够有效地发挥作用。
      </p>
    </v-responsive>
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn :disabled="!introVideo" prepend-icon="mdi-play-circle-outline" size="x-large" width="100%" class="mb-2"
          @click="playVideo(null, FileApi.filePath + introVideo)">
          简介视频
          <span v-show="!!introVideo">(已上传)</span>
        </v-btn>
        <VFileUpload v-model="introVideoFile" density="compact" accept=".mp4" title="点击或拖拽文件到此处"
          @update:model-value="handleIntroVideoFileUpdate">
          <template v-slot:item="{ props: itemProps, file }">
            <v-file-upload-item v-bind="itemProps" lines="one" nav>
              <template #append>
                <v-btn variant="text" icon="mdi-play-circle-outline" @click="playVideo(file)"></v-btn>
              </template>
            </v-file-upload-item>
          </template>
        </VFileUpload>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn :disabled="!guideVideo" prepend-icon="mdi-play-circle-outline" size="x-large" width="100%" class="mb-2"
          @click="playVideo(null, FileApi.filePath + guideVideo)">
          引导视频
          <span v-show="!!guideVideo">(已上传)</span>
        </v-btn>
        <VFileUpload v-model="guideVideoFile" density="compact" accept=".mp4" title="点击或拖拽文件到此处"
          @update:model-value="handleGuideVideoFileUpdate">
          <template v-slot:item="{ props: itemProps, file }">
            <v-file-upload-item v-bind="itemProps" lines="one" nav>
              <template #append>
                <v-btn variant="text" icon="mdi-play-circle-outline" @click="playVideo(file)"></v-btn>
              </template>
            </v-file-upload-item>
          </template>
        </VFileUpload>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { VFileUpload, VFileUploadItem } from 'vuetify/labs/VFileUpload'
import { useObjectUrl } from '@vueuse/core';
import GLightbox from 'glightbox'
import { FileApi } from '@/api/file';

const introVideo = defineModel('intro-video')
const guideVideo = defineModel('guide-video')
const introVideoFile = defineModel('intro-video-file')
const guideVideoFile = defineModel('guide-video-file')

const handleIntroVideoFileUpdate = (file) => {
  introVideo.value = useObjectUrl(file).value
}

const handleGuideVideoFileUpdate = (file) => {
  guideVideo.value = useObjectUrl(file).value
}

const playVideo = (file, uri) => {
  GLightbox({
    elements: [{ 'href': uri || useObjectUrl(file).value, 'type': 'video' }],
    autoplayVideos: true,
  }).open();
}
</script>

<style lang="scss" scoped></style>
