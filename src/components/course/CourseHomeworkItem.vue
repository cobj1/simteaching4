<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card class="mb-2 mx-2" ariant="text" style="box-shadow:none;" :class="{ 'elevation-4': isHovering }"
        v-bind="props">
        <template #default>
          <v-list-item class="px-6 py-4" :to="manage ? null : `/console/course/${route.params.id}/${item.id}`">
            <VListItemTitle class="d-flex justify-space-between align-center">
              <div class="homework-log">
                <v-row>
                  <v-col><v-icon icon="mdi-pencil-outline" size="30" class="mr-2" />
                    {{ item.title }}</v-col>
                </v-row>
                <v-row>
                  <v-col><span>开始时间 {{item.startTime}}</span></v-col>
                  <v-col><span>结束时间 {{item.endTime}}</span></v-col>
                  <v-col><span>发布教师 {{item.createrName}}</span></v-col>
                </v-row>
                <v-row v-if="item.log">
                  <v-col><span>审批人 {{log.aname?log.aname:'未审批'}}</span></v-col>
                  <v-col><span>审批时间 {{log.approvalTime?log.approvalTime:'未审批'}}</span></v-col>
                </v-row>
                <v-row v-if="item.log">
                  <v-col><span>评语 {{log.comment?log.comment:'未审批'}}</span></v-col>
                </v-row>
                <v-row v-else>
                  <v-col><span>备注 {{item.remarks}}</span></v-col>
                </v-row>
              </div>
            </VListItemTitle>
            <template #append>
              <span class="text-caption text-medium-emphasis">
                <v-chip prepend-icon="mdi-check-decagram-outline" v-if="item.log && item.log.id" class="mr-2">
                  {{score ? score + '分':'未审批'}}
                </v-chip>
               <!-- <v-chip v-else class="mr-2">
                  未上传作业
                </v-chip> -->
              </span>
              <v-btn @click="dialog=true">查看</v-btn>
              <v-btn>下载</v-btn>
              <v-btn>{{log?'修改作业':'提交作业'}}</v-btn>
            </template>
          </v-list-item>
        </template>
      </v-card>
    </template>
  </v-hover>
  <v-dialog v-model="dialog" max-width="1000px" scrollable>
    <v-card :loading="loadingEdit">
      <v-card-title>
        <span class="text-h5">查看作业</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="">
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import {
    useIconsAdapter
  } from '@/utils/icons-adapter';
  import {
    useDateFormat
  } from '@vueuse/core';
  import {
    ref
  } from 'vue';
  import {
    useRoute
  } from 'vue-router';

  const route = useRoute()
  const props = defineProps({
    item: Object,
    manage: Boolean
  })
  const emit = defineEmits(['deleted'])
  const log = ref(props.item.log)
  const score = ref(log.value ? log.value.score : null)
  const dialog = ref(false)

  const onChangeScore = () => {

  }
</script>

<style lang="scss" scoped>
  .homework-log {
    span {
      font-size: 11px;
    }
  }
</style>
