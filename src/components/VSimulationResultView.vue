<template>
  <v-responsive min-height="400">
    <v-container v-if="simulation" class="pa-6 pa-md-12 h-100 flex-column" fluid>
      <h1 class="font-weight-bold mb-4 text-h5 text-sm-h4 text-center">
        仿真实验结果
      </h1>
      <p class="text-subtitle-1 text-medium-emphasis mb-10 text-center">
        仿真实验结果是多方面的，它可以帮助我们更好地理解、预测、优化和控制各种系统和过程。
      </p>
      <v-row dense justify="center">
        <v-col cols="6">
          <v-sheet class="pa-6" rounded="lg" variant="flat">
            <v-list-item class="text-center" subtitle="实验得分">
              <template #title>
                <p class="text-h4 font-weight-bold pb-2">
                  {{ simulation.score }}
                </p>
              </template>
            </v-list-item>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet class="pa-6" rounded="lg" variant="flat">
            <v-list-item class="text-center" subtitle="实验用时">
              <template #title>
                <p class="text-h4 font-weight-bold pb-2">
                  {{ simulation.timeUsed }} 秒
                </p>
              </template>
            </v-list-item>
          </v-sheet>
        </v-col>
      </v-row>
      <section>
        <h3 class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold my-4">
          仿真实验步骤
        </h3>
        <v-data-table class="bg-transparent" hide-default-footer :headers="simulationStepsHeaders"
          :items="simulation.steps">
        </v-data-table>
      </section>
    </v-container>
    <v-empty-state v-else headline="没有数据"></v-empty-state>
  </v-responsive>
</template>

<script setup>
  defineProps({
    simulation: Object | String
  })

  const simulationStepsHeaders = [{
      title: '步骤名',
      key: 'name',
      align: 'start',
      nowrap: true
    },
    {
      title: '是否完成',
      key: 'correct',
      nowrap: true
    },
    {
      title: '得分',
      key: 'score',
      nowrap: true
    },
    {
      title: '满分',
      key: 'fullscore',
      nowrap: true
    },
    {
      title: '赋分模型',
      key: 'scoringModel',
      nowrap: true
    },
  ]
</script>

<style lang="scss" scoped></style>
