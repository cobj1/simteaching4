<template>
  <v-avatar color="blue-darken-3" :size="size || 34">
    <v-img v-if="avatar" :src="avatar"></v-img>
    <span v-else>{{ name.at(0) }}</span>
  </v-avatar>
</template>

<script setup>
defineProps(['avatar', 'name', 'size'])
</script>

<style lang="scss" scoped></style>
