<template>
  <v-container fluid max-width="1000px" min-height="800px">
    <v-card style="box-shadow:none;">
      <template #title>
        <div class="text-h4 pl-4">教师</div>
      </template>
      <VDivider class="py-2"></VDivider>
      <v-card-text class="pa-0">
        <v-card class="mb-2 mx-2 ml-4" ariant="text" style="box-shadow:none;">
          <v-list-item :title="creator.name" class="pa-4">
            <template #prepend>
              <v-avatar color="grey-lighten-1">
                <v-avatar image="@/assets/avatar/default-avatar.svg" />
              </v-avatar>
            </template>
          </v-list-item>
        </v-card>
      </v-card-text>
    </v-card>
    <v-card class="mt-8" style="box-shadow:none;">
      <template #title>
        <div class="text-h4 pl-4">学生</div>
      </template>
      <template #append v-if="manage">
        <v-btn size="x-large" icon density="comfortable">
          <v-icon icon="mdi-account-multiple-plus-outline"></v-icon>
          <SelectionUser @confirm="handleSelectionUserConfirm"></SelectionUser>
        </v-btn>
      </template>
      <v-card class="mb-2 mx-2 ml-4" ariant="text" style="box-shadow:none;">
        <v-list item-value="id" item-title="name">
          <v-list-item link :title="item.name" v-for="item in items" :key="item.id" class="pa-4">
            <template #prepend>
              <v-avatar color="grey-lighten-1">
                <v-avatar image="@/assets/avatar/default-avatar.svg" />
              </v-avatar>
            </template>
            <template #append v-if="manage">
              <UserOptions @deleted="handleUserOptionsDeleted(item.id)"></UserOptions>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
      <v-empty-state v-if="items.length == 0">
        <template #media>
          <VDivider class="py-2"></VDivider>
          <v-img class="my-8" src="@/assets/svg/empty-cat.svg" height="200px"></v-img>
        </template>
        <template v-slot:title>
          <div class="text-subtitle-2 mt-8">
            向此课程添加学生
          </div>
        </template>
        <template v-slot:actions>
          <v-btn prepend-icon="mdi-account-multiple-plus-outline" variant="text" rounded="lg">
            邀请学生
            <SelectionUser @confirm="handleSelectionUserConfirm"></SelectionUser>
          </v-btn>
        </template>
      </v-empty-state>
    </v-card>
  </v-container>
</template>

<script setup>
import { CourseUserApi } from '@/api/course/course-user';
import { UserApi } from '@/api/user/user';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps({
  data: Object,
  manage: Boolean
})
const items = ref([])
const creator = ref({})

watch(() => props.data?.creator, () => loadCreator())
watch(() => route.params.id, () => loadItems())

const handleUserOptionsDeleted = async (id) => {
  await CourseUserApi.del(route.params.id, id)
  loadItems()
}
const handleSelectionUserConfirm = async (value) => {
  await CourseUserApi.save(JSON.stringify(value.map(item => {
    return { cid: route.params.id, uid: item }
  })))
  loadItems()
}

const loadCreator = async () => {
  creator.value = await UserApi.publicInfo(props.data?.creator)
}
const loadItems = async () => {
  items.value = await CourseUserApi.list(route.params.id)
}

onMounted(() => {
  loadItems()
  loadCreator()
})
</script>

<style lang="scss" scoped></style>
