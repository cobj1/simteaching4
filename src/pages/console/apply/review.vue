<template>
  <v-card>

    <v-data-iterator :items="list" :items-per-page="3" :search="search" :loading="loading">
      <template v-slot:header>
        <v-toolbar class="pr-2">
          <template #title v-if="!$vuetify.display.smAndDown">
            角色列表
          </template>
          <v-btn-group variant="outlined" divided class="mx-2">
            <v-btn :variant="queryState == '0' ? 'tonal' : null" @click="queryState = '0'">未审核</v-btn>
            <v-btn :variant="queryState == '1' ? 'tonal' : null" @click="queryState = '1'">通过</v-btn>
            <v-btn :variant="queryState == '2' ? 'tonal' : null" @click="queryState = '2'">未通过</v-btn>
          </v-btn-group>
          <v-text-field v-model="search" class="ml-2" density="comfortable" placeholder="检索"
            prepend-inner-icon="mdi-magnify" style="max-width: 300px;" variant="solo" clearable
            hide-details></v-text-field>
        </v-toolbar>
        <v-empty-state v-if="list.length==0" icon="mdi-magnify"
          text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
          title="We couldn't find a match."></v-empty-state>
      </template>

      <template v-slot:default="{ items }">

        <template v-for="(item, i) in items" :key="i">
          <v-card v-bind="item.raw">
            <v-card-text v-if="item.raw.state == 0" class=" pt-4 d-flex ga-2 justify-end">
              <v-btn color="blue-darken-4"
                @click="dialog = true; dialogForm.id = item.raw.id; dialogForm.title = item.raw.title;">审核</v-btn>
            </v-card-text>
            <v-card-text v-else class=" pt-4 d-flex ga-2 justify-end">
              <v-btn disabled>已审核</v-btn>
            </v-card-text>
          </v-card>
          <br>
        </template>

      </template>

      <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
        <div class="d-flex align-center justify-center pa-4">
          <v-btn :disabled="page === 1" density="comfortable" icon="mdi-arrow-left" variant="tonal" rounded
            @click="prevPage"></v-btn>

          <div class="mx-2 text-caption">
            Page {{ page }} of {{ pageCount }}
          </div>

          <v-btn :disabled="page >= pageCount" density="comfortable" icon="mdi-arrow-right" variant="tonal" rounded
            @click="nextPage"></v-btn>
        </div>
      </template>
    </v-data-iterator>

    <v-dialog v-model="dialog" max-width="500">
      <template #default>
        <v-card rounded="lg">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="text-h5 text-medium-emphasis ps-2">
              试用申请审核
            </div>

            <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
          </v-card-title>

          <v-divider class="mb-4"></v-divider>

          <v-card-text>
            <div class="text-medium-emphasis mb-4">
              <strong>{{ dialogForm.title }}</strong>请进行此试用申请审核操作。
            </div>
            <v-radio-group v-model="dialogForm.state">
              <v-radio value="1">
                <template v-slot:label>
                  <div>同意并创建账号</div>
                </template>
              </v-radio>
              <v-radio value="2">
                <template v-slot:label>
                  <div>拒绝</div>
                </template>
              </v-radio>
            </v-radio-group>
            <v-date-input v-model="dialogForm.deadline" :disabled="dialogForm.state != '1'" label="请选择试用截止时间"
              variant="solo" prepend-icon=""></v-date-input>
            <div class="mb-2">通知 (可选)</div>
            <v-textarea :counter="300" class="mb-2" rows="2" variant="outlined" persistent-counter></v-textarea>
          </v-card-text>

          <v-divider class="mt-2"></v-divider>

          <v-card-actions class="my-2 d-flex justify-end">
            <v-btn class="text-none" rounded="xl" text="取消操作" @click="dialog = false"></v-btn>
            <v-btn class="text-none" color="primary" rounded="xl" variant="flat" @click="examine">
              {{ dialogForm.state == '0' ? '审核并创建账号' : '审核' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-card>
</template>
<script setup>
import { VDateInput } from 'vuetify/labs/VDateInput'
import { ApplayApi } from '@/api/apply';
import { onMounted, reactive, ref, watch } from 'vue';
import { useDateFormat } from '@vueuse/core';
import { useSystemStore } from '@/stores/system';

const systemStore = useSystemStore()
const loading = ref(true)
const dialog = ref(false)
const dialogForm = reactive({
  id: null,
  name: null,
  deadline: new Date(),
  describe: '',
  state: '1'
})
const queryState = ref(0)
const search = ref('')
const list = ref([])

watch(queryState, () => load())

const examine = async () => {
  systemStore.dialogLoading = true
  await ApplayApi.examine(dialogForm.id, useDateFormat(dialogForm.deadline, 'YYYY-MM-DD').value, dialogForm.describe, dialogForm.state)
  systemStore.dialogLoading = false
  dialog.value = false
  load()
}

const load = async () => {
  const res = await ApplayApi.page(queryState.value)
  list.value = res.records.map(item => {
    return {
      id: item.id,
      title: `${item.name} （ 联系方式: ${item.phone} ）`,
      subtitle: `组织: ${item.org}`,
      text: item.illustrate,
      date: item.createTime,
      state: item.state
    }
  })
  loading.value = false;
}

onMounted(() => {
  load()
})

</script>
