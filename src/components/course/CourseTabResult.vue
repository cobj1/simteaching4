<template>
  <v-data-table-virtual :headers="headers" :items="items" item-key="name" mobile>
    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template v-slot:item.name="{ item }">
      <v-avatar-pro :avatar="item.avatar" :name="item.name" size="32" class="mr-2"></v-avatar-pro>
      {{ item.name }}
    </template>
  </v-data-table-virtual>
</template>

<script setup>
import { CourseApi } from '@/api/course/course';
import { CourseResourceApi } from '@/api/course/course-resource';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const headers = ref([
  { title: '用户', value: 'name', minWidth: '200px', fixed: true, }
])
const items = ref([])

const loadResources = async () => {
  const courseword = { title: '课业', children: [], removable: true }
  const res = await CourseResourceApi.list(route.params.id)
  console.log(res)
  res.forEach(item => {
    courseword.children.push({
      title: item.resource.name,
      value: item.id,
      minWidth: '200px',
      removable: true
    })
  })
  headers.value.push(courseword)
}

const loadItems = async () => {
  const res = await CourseApi.transcript(route.params.id)
  res.forEach(item => {
    const findItem = items.value.find(user => user.id == item.id)
    if (findItem) {
      findItem.resource.push({
        crid: item.crid,
        rid: item.rid,
        type: item.type,
        order: item.order
      })
    } else {
      items.value.push({
        id: item.id,
        name: item.name,
        post: item.post,
        avatar: item.avatar,
        account: item.account,
        resource: [{
          crid: item.crid,
          rid: item.rid,
          type: item.type,
          order: item.order
        }]
      })
    }
  })
  console.log(items.value)
}

onMounted(() => {
  loadItems()
  loadResources()
})
</script>

<style lang="scss" scoped></style>
