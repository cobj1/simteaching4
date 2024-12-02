<template>
  <div width="500px">
    <VCard>
      <VToolbar :title="title">
        <ResourceCategory>
          <v-btn prepend-icon="mdi-format-list-bulleted-type">类型管理</v-btn>
        </ResourceCategory>
      </VToolbar>
    </VCard>
    <div class="d-flex pt-4" :class="{ 'flex-column': $vuetify.display.mdAndDown }">
      <div class="flex-1-1 text-center">
        <v-list v-model:selected="selected" mandatory max-width="1000px" class="ma-auto" active-color="transparent"
          bg-color="transparent" base-color="transparent">
          <v-list-item :value="0">
            <div class="pa-2">
              <v-alert border="top" class="pa-0" elevation="2">
                <v-alert border="start" :border-color="selected[0] == 0 ? '' : '#FFFFFF00'">
                  <v-text-field label="标题" hide-details :disabled="loadingEdit" variant="underlined"></v-text-field>
                </v-alert>
              </v-alert>
            </div>
          </v-list-item>
          <v-list-item v-for="(item, index) in items" :key="item.value" :value="item.value">
            <div class="pa-2">
              <v-alert border="start" :border-color="selected[0] == index + 1 ? '' : '#FFFFFF00'" elevation="2">
                <template #title>
                  试题标题
                </template>
                XXXXXXXXXXXXXXXXXXXXXXXXXX
              </v-alert>
            </div>
          </v-list-item>
        </v-list>

        <v-btn prepend-icon="mdi-plus" class="my-4" color="primary" size="x-large" rounded elevation="2">添加试题
          <SelectionQuestions></SelectionQuestions>
        </v-btn>
      </div>
      <VCard max-width="600px" min-width="300px">
        <v-container>
          <v-row>
            <v-col cols="12">
              布置给
            </v-col>
            <v-col cols="12">
              <v-text-field label="标题" hide-details :disabled="loadingEdit"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select label="类型" hide-details :items="categorys" item-title="name" item-value="id"
                :disabled="loadingEdit"></v-select>
            </v-col>
          </v-row>
        </v-container>
      </VCard>
    </div>
  </div>

</template>

<script setup>
import { ResourceTestpaperApi } from '@/api/resource-paper';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute()
const item = ref({})
const title = computed(() => route.params.id == 'add' ? '新增' : '修改')
const items = ref([
  {
    title: 'Item #1',
    value: 1,
  },
  {
    title: 'Item #2',
    value: 2,
  },
  {
    title: 'Item #3',
    value: 3,
  },
])
const selected = ref([1])

const loadItem = async () => {
  item.value = await ResourceTestpaperApi.info(route.params.id)
}

onMounted(() => loadItem())
</script>

<style lang="scss" scoped></style>
