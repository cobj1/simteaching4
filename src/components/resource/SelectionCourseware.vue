<template>
  <v-dialog v-model="dialog" activator="parent" max-width="1000px" :fullscreen="$vuetify.display.smAndDown" scrollable>
    <v-card>
      <Courseware enable-selection v-model="selected"></Courseware>
      <v-divider></v-divider>
      <v-card-actions>
        <div>
          <strong>已选: </strong> {{ selected.length }}
        </div>
        <v-spacer></v-spacer>
        <v-btn text="关闭" variant="plain" @click="close()"></v-btn>
        <v-btn color="primary" text="保存" variant="tonal" :disabled="selected.length == 0" @click="save()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import Courseware from '@/pages/console/resource/courseware.vue';
import { nextTick, ref } from 'vue';

const emit = defineEmits(['confirm'])
const dialog = ref(false)
const selected = ref([])

const close = () => {
  dialog.value = false
  nextTick(() => {
    selected.value = []
  })
}

const save = () => {
  emit('confirm', selected.value)
  close()
}
</script>

<style lang="scss" scoped></style>
