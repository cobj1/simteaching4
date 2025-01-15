<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card class="mb-2 mx-2" ariant="text" style="box-shadow:none;" :class="{ 'elevation-4': isHovering }"
        v-bind="props">
        <template #default>
          <v-list-item class="px-6 py-4" :to="manage ? null : `/console/course/${route.params.id}/${item.id}`">
            <VListItemTitle class="d-flex justify-space-between align-center">
              <div>
                <v-icon :icon="useIconsAdapter(item.resource.resourceType)" size="30" class="mr-2" />
                {{ item.resource.name }}
              </div>
            </VListItemTitle>
            <template #append v-if="manage">
              <v-text-field label="分数" v-model="score" type="number" variant="underlined" hide-details density="compact"
                :min="1" :max="100" :disabled="['testpaper', 'simulation'].includes(item.resource.resourceType)"
                v-if="['questions', 'testpaper', 'simulation', 'report_template'].includes(item.resource.resourceType)"
                @click.stop @change="onChangeScore"></v-text-field>
              <CourseResourceItemOptions @deleted="emit('deleted')"></CourseResourceItemOptions>
            </template>
            <template #append v-else>
              <span class="text-caption text-medium-emphasis">
                <v-chip prepend-icon="mdi-check-decagram-outline" v-if="item.log && item.log.id" class="mr-2">
                  已提交
                </v-chip>
                发布时间: {{ useDateFormat(item.createTime, 'YYYY-MM-DD') }}
              </span>
            </template>
          </v-list-item>
        </template>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup>
import { CourseResourceApi } from '@/api/course/course-resource';
import { useIconsAdapter } from '@/utils/icons-adapter';
import { useDateFormat } from '@vueuse/core';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const props = defineProps({
  item: Object,
  manage: Boolean
})
const emit = defineEmits(['deleted'])
const score = ref(props.item.score)

const onChangeScore = () => {
  CourseResourceApi.updateScore(props.item.id, score.value)
}

</script>

<style lang="scss" scoped></style>
