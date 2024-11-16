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

watch(isDark, () => {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}, {
  immediate: true
})

</script>
