<template>
  <div class="border pa-4">
    <a v-if="['png', 'jpg'].includes(item.ext)" :href="item.url" class="glightbox" data-type="image">
      <img :src="item.url" alt="image" class="w-100" />
    </a>
    <video v-else-if="item.ext == 'mp4'" :src="item.url" id="player" controls></video>
    <audio v-else-if="item.ext == 'mp3'" :src="item.url" controls preload class="d-flex ma-auto my-8"> </audio>
    <vue-office-docx v-else-if="item.ext == 'docx'" :src="item.url" style="height: calc(100vh - 300px)" />
    <vue-office-excel v-else-if="item.ext == 'xlsx'" :src="item.url" style="height: calc(100vh - 300px)" />
    <vue-office-pdf v-else-if="item.ext == 'pdf'" :src="item.url" style="height: calc(100vh - 300px)" />
    <section v-else-if="['xml', 'txt'].includes(item.ext)">
      <p v-text="item.text"> </p>
    </section>
    <v-btn v-else prepend-icon="mdi-download" :href="item.url" target="_blank">下载</v-btn>
  </div>
</template>

<script setup>
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'

const item = defineModel()

defineProps({
  completed: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped></style>
