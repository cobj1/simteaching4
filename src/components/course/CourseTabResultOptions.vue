<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-dots-vertical" density="comfortable" variant="text" v-bind="props"></v-btn>
    </template>
    <v-list width="200">
      <v-list-item title="查看作答记录" prepend-icon="mdi-eye-outline" link @click="viewItem">
      </v-list-item>
      <v-list-item title="删除记录" prepend-icon="mdi-delete" link @click="deleteItem">
      </v-list-item>
    </v-list>
  </v-menu>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">您确定要删除此项目吗？</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete">取消</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">确定</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['deleted', 'view'])
const dialogDelete = ref(false)

const deleteItem = () => {
  dialogDelete.value = true;
}
const viewItem = () => {
  emit('view')
}
const closeDelete = () => {
  dialogDelete.value = false;
}
const deleteItemConfirm = async () => {
  emit('deleted')
  closeDelete()
}
</script>

<style scoped></style>
