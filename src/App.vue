<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { onMounted } from 'vue';
import { watch } from 'vue';
import {   useTheme } from 'vuetify'

const theme = useTheme()
const isDark = useDark()
// const { mobile } = useDisplay()

watch(isDark, () => {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}, {
  immediate: true
})

onMounted(() => {
  // console.log(mobile)
})
</script>
