<template>
  <VSheet class="pa-2">
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'code'"
      src="@/assets/file-format/code.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'excel'"
      src="@/assets/file-format/excel.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'folder'"
      src="@/assets/file-format/folder.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'misc'"
      src="@/assets/file-format/misc.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'pdf'"
      src="@/assets/file-format/pdf.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'ppt'"
      src="@/assets/file-format/ppt.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'text'"
      src="@/assets/file-format/text.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'video'"
      src="@/assets/file-format/video.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'word'"
      src="@/assets/file-format/word.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'wp'"
      src="@/assets/file-format/wp.png"></v-img>
    <v-img height="50px" width="50px" class="d-block mx-auto mb-4 mt-8" v-if="icon == 'zip'"
      src="@/assets/file-format/zip.png"></v-img>
    <v-img height="98px" width="100%" v-if="icon == 'picture'" src="https://cdn.vuetifyjs.com/images/cards/house.jpg"></v-img>
  </VSheet>
</template>

<script setup>
import { FileFormat } from '@/utils/file-format';
import { computed } from 'vue';

const props = defineProps(['file'])

const icon = computed(() => FileFormat(props.file))
</script>

<style lang="scss" scoped></style>
