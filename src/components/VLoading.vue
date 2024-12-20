<template>
  <v-dialog v-model="systemStore.dialogLoading" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item prepend-icon="/favicon.ico" title="Application Loading ...">
        <template v-slot:prepend>
          <div class="pe-4">
            <v-img width="30" height="30" src="/favicon.ico" />
          </div>
        </template>
        <template v-slot:append>
          <v-progress-circular color="primary" indeterminate="disable-shrink" size="16" width="2"></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script setup>
import { useSystemStore } from '@/stores/system';

const systemStore = useSystemStore()
</script>

<style lang="scss" scoped></style>
