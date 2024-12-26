<template>
  <v-dialog v-model="dialog" activator="parent" max-width="1000px" :fullscreen="$vuetify.display.smAndDown" scrollable>
    <template #default>
      <v-card prepend-icon="mdi-ab-testing" title="选择作业测试">
        <v-divider></v-divider>

        <v-card-text class="pa-0">
          <Testpaper enable-selection v-model="selected"></Testpaper>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text="关闭" @click="close()"></v-btn>

          <v-spacer></v-spacer>

          <div> <strong>已选: </strong> {{ selected.length }} </div>

          <v-btn color="surface-variant" text="保存" variant="flat" :disabled="selected.length == 0"
            @click="save()"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import Testpaper from '@/pages/console/resource/testpaper/index.vue';
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
