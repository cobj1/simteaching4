<template>
    <v-switch class="pr-4" v-model="isDark" :label="isDark ? '暗色主题' : '浅色主题'" hide-details></v-switch>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme()
const isDark = ref(theme.global.name.value == 'dark')

watch(isDark, (value) => {
    theme.global.name.value = value ? 'dark' : 'light'
    if (value) {
        document.body.classList.add('ckeditor-dark')
    } else {
        document.body.classList.remove('ckeditor-dark')
    }
})
</script>

<style scoped></style>