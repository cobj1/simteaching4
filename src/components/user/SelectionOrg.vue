<template>
  <v-dialog v-model="dialog" activator="parent" max-width="600px" :fullscreen="$vuetify.display.smAndDown" scrollable>

    <template #default>
      <v-card prepend-icon="mdi-bank" title="选择组织">
        <v-divider></v-divider>

        <v-card-text class="pa-0">
          <Org enable-selection v-model="selected"></Org>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text="关闭" @click="close()"></v-btn>

          <v-spacer></v-spacer>

          <v-btn color="surface-variant" text="保存" variant="flat" :disabled="selected.length == 0"
            @click="save()"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { OrgApi } from '@/api/user/org';
import Org from '@/pages/console/org.vue';
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

const save = async () => {
  const extractIds = (org) => {
    let ids = []
    if (org?.id)
      ids.push(org.id)
    if (org?.parent)
      ids.push(...extractIds(org.parent))
    return ids
  }
  const org = await OrgApi.selectOneAndParentById(selected.value.join(''))
  emit('confirm', extractIds(org).reverse())
  close()
}
</script>

<style lang="scss" scoped></style>
