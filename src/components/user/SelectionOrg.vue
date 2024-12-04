<template>
  <v-dialog v-model="dialog" activator="parent" max-width="800px">
    <v-card>
      <Org enable-selection v-model="selected"></Org>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="关闭" variant="plain" @click="close()"></v-btn>
        <v-btn color="primary" text="保存" variant="tonal" :disabled="selected.length == 0" @click="save()"></v-btn>
      </v-card-actions>
    </v-card>
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
