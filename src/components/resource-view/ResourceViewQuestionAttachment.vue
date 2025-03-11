<template>
    <div class="mb-2 text-center">
        <v-img v-if="attachment?.includes('.png') || attachment?.includes('.jpg')" :src="useFileUri(attachment)"
            max-height="300px"></v-img>

        <video v-if="attachment?.includes('.mp4')" :src="useFileUri(attachment)" max-height="300px" controls></video>
    </div>

</template>

<script setup>
import { useFileUri } from '@/utils/simulation-uri';

defineProps({
    attachment: String
})
</script>

<style lang="scss" scoped></style>