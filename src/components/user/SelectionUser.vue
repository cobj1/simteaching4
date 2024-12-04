<template>
  <v-dialog v-model="dialog" activator="parent" max-width="1200px">
    <v-card>
      <User enable-selection v-model="selected" :rids="rids"></User>
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
import User from '@/pages/console/user/[rids].vue';
import { useRoleStore } from '@/stores/role';
import { computed, nextTick, onMounted, ref } from 'vue';

const roleStore = useRoleStore()
const emit = defineEmits(['confirm'])
const dialog = ref(false)
const selected = ref([])
const roleItems = ref([])

const rids = computed(() => roleItems.value.map(item => item.id).join(','))

const close = () => {
  dialog.value = false
  nextTick(() => {
    selected.value = []
  })
}

const save = async () => {
  emit('confirm', selected.value)
  close()
}

onMounted(async () => {
  roleItems.value = await roleStore.items()
})
</script>

<style lang="scss" scoped></style>
