<template>
  <v-dialog v-model="dialog" activator="parent" max-width="1000px" :fullscreen="$vuetify.display.smAndDown" scrollable>
    <template #default>
      <v-card prepend-icon="mdi-ab-testing" title="选择报告模板">
        <v-divider></v-divider>

        <v-card-text class="pa-0">
          <ReportTemplate enable-selection v-model="selected"></ReportTemplate>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div v-show="selected"> 已选择  </div>
          <div v-show="!selected"> 未选择  </div>

          <v-spacer></v-spacer>

          <v-btn text="关闭" @click="close()"></v-btn>

          <v-btn color="surface-variant" text="保存" variant="flat" :disabled="!selected"
            @click="save()"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import ReportTemplate from '@/pages/console/resource/report-template.vue';
import { nextTick, ref } from 'vue';

const emit = defineEmits(['confirm'])
const dialog = ref(false)
const selected = ref()

const close = () => {
  dialog.value = false
  nextTick(() => {
    selected.value = null
  })
}

const save = () => {
  emit('confirm', selected.value)
  close()
}
</script>

<style lang="scss" scoped></style>
