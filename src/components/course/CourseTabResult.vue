<template>
  <div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-scoreboard-outline">
        设置课程分数权重
        <CourseScoreWeight></CourseScoreWeight>
      </v-btn>
    </v-card-actions>
    <VDivider></VDivider>
    <v-data-table-virtual :headers="headers" :items="items" item-key="name" :mobile="$vuetify.display.smAndDown">
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.name="{ item }">
        <v-avatar-pro :avatar="item.avatar" :name="item.name" size="32" class="mr-2"></v-avatar-pro>
        {{ item.name }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.totalScore="{ item }">
        {{ item.totalScore }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.weightScore="{ item }">
        {{ Math.round(item.weightScore) }} / 100
      </template>

      <!-- eslint-disable-next-line vue/no-unused-vars -->
      <template v-slot:[`item.id_${cr.id}`]="{ item, index }" v-for="(cr, crIndex) in crs" :key="cr.id">
        <div class="d-flex" v-if="items[index].resource[crIndex].crlid">
          <v-text-field v-model="items[index].resource[crIndex].score" type="number" :min="0" :max="cr.score"
            hide-details density="compact" variant="underlined" single-line :suffix="`/ ${cr.score} 分`" class="mr-2"
            max-width="120px" @change="handleResultUpdateScore(items[index].resource[crIndex])">
          </v-text-field>
          <CourseTabResultOptions @deleted="handleResultDeleted(items[index].resource[crIndex])"
            @view="courseTabResultViewRef.open(items[index].resource[crIndex])">
          </CourseTabResultOptions>
        </div>
      </template>
    </v-data-table-virtual>
    <CourseTabResultView ref="courseTabResultViewRef"></CourseTabResultView>
  </div>
</template>

<script setup>
import { CourseApi } from '@/api/course/course';
import { CourseResourceApi } from '@/api/course/course-resource';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const headers = ref([
  { title: '用户', value: 'name', fixed: true, nowrap: true },
])
const items = ref([])
const crs = ref([]) // CourseResources
const courseTabResultViewRef = ref()

watch(() => route.params.id, () => {
  loadItems()
  loadResources()
})

const handleResultDeleted = (item) => {
  CourseResourceApi.logDel(item.crlid)
  item.crlid = null
  UpdateTotalScoreAndWeightScore()
}
const handleResultUpdateScore = (item) => {
  CourseResourceApi.logUpdateScore(item.score, item.crlid)
  UpdateTotalScoreAndWeightScore()
}

/**
 * 计算总分和权重的分
*/
const UpdateTotalScoreAndWeightScore = () => {
  items.value.forEach(userDataItem => {
    userDataItem.totalScore = 0
    userDataItem.weightScore = 0
    userDataItem.resource.forEach(resourceDataItem => {
      if (resourceDataItem.score > 0) userDataItem.totalScore += resourceDataItem.score * 1
      if (resourceDataItem.weight > 0) userDataItem.weightScore += resourceDataItem.weight
      // 默认权重分数 （单权重分）*（单得分/单总分）
      else userDataItem.weightScore += resourceDataItem.score > 0 ? (100 / crs.value.length) * (resourceDataItem.score / resourceDataItem.maxScore) : 0
    })
  })
}

const loadResources = async () => {
  headers.value.splice(1, headers.value.length)
  const coursework = { title: '课业', value: 'coursework', children: [] }
  const res = await CourseResourceApi.list(route.params.id)
  crs.value = res.filter(item => ['questions', 'testpaper', 'simulation'].includes(item.type))
  crs.value.forEach(item => {
    const title = `${item.resource.name} ( 满分:${item.score} )`
    coursework.children.push({ title, value: `id_${item.id}`, nowrap: true, minWidth: '180px' })
  })
  headers.value.push(coursework)

  headers.value.push({ title: '总分', value: 'totalScore', fixed: true, nowrap: true, minWidth: '100px', width: 100, headerProps: { style: 'right: 100px; border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));' }, cellProps: { style: 'right: 100px; border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));' } })
  headers.value.push({ title: '权重得分', value: 'weightScore', fixed: true, nowrap: true, minWidth: '100px', width: 100, headerProps: { style: 'right: 0px; border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));' }, cellProps: { style: 'right: 0px; border-left: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));' } })
}

const loadItems = async () => {
  items.value = []
  const res = await CourseApi.transcript(route.params.id)
  res.forEach(item => {
    const userDataItem = items.value.find(user => user.id == item.id)
    if (userDataItem) {
      const resourceDataItem = {
        crid: item.crid,
        rid: item.rid,
        crlid: item.crlid,
        type: item.type,
        order: item.order,
        score: item.score,
        maxScore: item.max_score,
        createTime: item.create_time
      }
      userDataItem.resource.push(resourceDataItem)
    } else {
      const resourceDataItem = {
        crid: item.crid,
        rid: item.rid,
        crlid: item.crlid,
        type: item.type,
        order: item.order,
        score: item.score,
        maxScore: item.max_score,
        createTime: item.create_time
      }
      const userDataItem = {
        id: item.id,
        name: item.name,
        post: item.post,
        avatar: item.avatar,
        account: item.account,
        totalScore: 0,
        weightScore: 0,
        resource: [resourceDataItem]
      }
      items.value.push(userDataItem)
    }
  })
  UpdateTotalScoreAndWeightScore()
}

onMounted(async () => {
  await loadResources()
  loadItems()
})
</script>

<style lang="scss" scoped></style>
