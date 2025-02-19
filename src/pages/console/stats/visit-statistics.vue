<template>
  <div>
    <v-card>
      <v-container max-width="100%">
        <v-row no-gutters class="border-md border-b-0">
          <v-col class="border-b-md">
            <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
              :style="{ backgroundColor: 'rgb(var(--v-theme-surface-light))' }">
              平台总访问量（次）
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
              {{pastat.totalCount}}
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
              :style="{ backgroundColor: 'rgb(var(--v-theme-surface-light))' }">
              本周访问量
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
              {{pastat.weeklyCount}}
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
              :style="{ backgroundColor: 'rgb(var(--v-theme-surface-light))' }">
              学生用户量
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
              {{pastat.stuCount}}
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
              :style="{ backgroundColor: 'rgb(var(--v-theme-surface-light))' }">
              教师用户量
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
              {{pastat.teaCount}}
            </v-sheet>
          </v-col>
          <v-responsive width="100%"></v-responsive>
          <v-col class="border-b-md">
            <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
              :style="{ backgroundColor: 'rgb(var(--v-theme-surface-light))' }">
              使用时长
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
              {{pastat.useTime}}
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2" :class="['d-flex justify-center align-center']"
              :style="{ backgroundColor: 'rgb(var(--v-theme-surface-light))' }">
              当前在线人数
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
              {{pastat.onlineTime}}
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
            </v-sheet>
          </v-col>
          <v-col class="border-b-md">
          </v-col>
          <v-col class="border-b-md">
            <v-sheet class="pa-2">
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <VCard style="margin-top: 10px;">
      <v-container max-width="100%">
        <!-- <div class="d-flex">
          <v-date-input hide-details v-model="dateRange" label="选择范围" max-width="368" multiple="range"
            class="ma-2 flex-1-1" @update:options="handleChange"></v-date-input>
        </div> -->
        <VRow>
          <v-col md="4">
            <v-card>
              <v-toolbar title="每日登录情况"><v-btn @click="handleClick">导出为Excel</v-btn></v-toolbar>
              <canvas id="line"></canvas>
            </v-card>
          </v-col>
        </VRow>
      </v-container>

    </VCard>
  </div>
</template>

<script setup>
  import {
    onMounted,
    ref
  } from 'vue';
  import {
    Chart
  } from 'chart.js/auto';
  import {
    StatisticsApi
  } from '@/api/statistics';
  import {
    VDateInput
  } from 'vuetify/labs/VDateInput'

  const dateRange = ref(null);
  const pastat = ref({});
  const days = 30;
  const labels = Array.from({
    length: days
  }, (_, i) => i + 1);
  const data = Array.from({
    length: days
  }, () => Math.floor(Math.random() * 1000));

  const config = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '登录人次',
        data,
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 1,
        fill: false,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const handleChange = () => {
    console.log(dateRange.value[0])
    console.log(dateRange.value[1])
  };

  const handleClick = () => {
    /* console.log(data.value); */
    // 在这里执行你的逻辑
    const ws = XLSX.utils.json_to_sheet(data.value);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'binary'
    });
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    saveAs(dataBlob, '曲线图数据.xlsx');
  };

  const load = async () => {
    const res1 = await StatisticsApi.dailyLoginStat()

    const res = await StatisticsApi.visitStat()
    if (res) {
      pastat.value = res
    }
  }

  onMounted(() => {
    const ctx = document.getElementById('line').getContext('2d');
    new Chart(ctx, config);
    load()
  })
</script>

<style lang="scss" scoped></style>
