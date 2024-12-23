<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-dots-vertical" variant="text" :size="30" v-bind="props"></v-btn>
    </template>
    <v-list width="160">
      <v-list-item title="重命名" prepend-icon="mdi-rename" link @click="emit('rename')">
      </v-list-item>
      <v-list-item title="删除" prepend-icon="mdi-delete" link @click="deleteItem">
      </v-list-item>
      <!-- <v-divider></v-divider>
      <v-list-item title="上移" prepend-icon="mdi-arrow-up" link>
      </v-list-item>
      <v-list-item title="下移" prepend-icon="mdi-arrow-down" link>
      </v-list-item> -->
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
import { CourseSubjectApi } from '@/api/course/course-subject';
import { ref } from 'vue';

const emit = defineEmits(['change', 'rename'])
const props = defineProps({ item: Object })
const dialogDelete = ref(false)

const deleteItem = async () => {
  dialogDelete.value = true;
}


const closeDelete = () => {
  dialogDelete.value = false;
}

const deleteItemConfirm = async () => {
  await CourseSubjectApi.del(props.item?.id)
  emit('change')
  closeDelete()
}

</script>

<style scoped></style>
