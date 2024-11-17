<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { watch } from 'vue';
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = useDark()

watch(isDark, (value) => {
  theme.global.name.value = value ? 'dark' : 'light'
  if (value) {
    document.body.classList.add('ckeditor-dark')
  }
}, {
  immediate: true
})

</script>
