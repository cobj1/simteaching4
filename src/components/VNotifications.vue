<template>
  <notifications classes="my-notification">
    <template #body="props">
      <div class="my-notification" :class="[props.item.type]" @click="props.close">
        <div class="notification-title d-flex align-center ga-2 mb-2">
          <v-icon v-if="props.item.data.icon" :icon="props.item.data.icon" size="20"></v-icon>
          {{ props.item.title }}
        </div>
        <div class="notification-content">{{ props.item.text }} </div>
      </div>
    </template>
  </notifications>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
