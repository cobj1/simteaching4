<template>
  <notifications style="width: auto;">
    <template #body="props">
      <!-- <div class="my-notification" :class="[props.item.type]" @click="props.close">
        <div class="notification-title d-flex align-center ga-2 mb-2">
          <v-icon v-if="props.item.data.icon" :icon="props.item.data.icon" size="20"></v-icon>
          {{ props.item.title }}
        </div>
        <div class="notification-content">{{ props.item.text }} </div>
      </div> -->
      <v-card class="ma-2 justify-self-end" color="surface" rounded="lg"
        style="max-width: 670px; min-width: 300px; width: fit-content; justify-self: end;">
        <template #text>
          <div class="d-flex align-start">
            <v-icon v-if="props.item.data.icon" :icon="props.item.data.icon" start />
            <div>
              <strong class="d-inline-block text-subtitle-2 mb-1">{{ props.item.title }}</strong>
              <div>
                {{ props.item.text }}
              </div>
            </div>
          </div>
        </template>
      </v-card>
    </template>
  </notifications>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
