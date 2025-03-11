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
    StatisticsApi
  } from '@/api/statistics';
  import {
    VDateInput
  } from 'vuetify/labs/VDateInput'
  import {
    Chart
  } from 'chart.js/auto';
  import 'chartjs-adapter-date-fns';

  const dateRange = ref(null);
  const pastat = ref({});
  const dates = ref([]);
  const point = ref([]);

  const createChart = async () => {
    const labels = getLastMonthDates();
    const data = {
      labels: labels,
      datasets: [{
        label: '登录人次',
        data: await getData(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1, // 曲线的张力（平滑度）
      }]
    };
    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time'
          },
          y: {
            beginAtZero: true // Y轴从0开始
          }
        }
      }
    };
    const ctx = document.getElementById('line').getContext('2d');
    new Chart(ctx, config);
  }

  const getLastMonthDates = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    while (lastMonth <= today) {
      dates.value.push(lastMonth.toISOString().split('T')[0]); // YYYY-MM-DD格式
      lastMonth.setDate(lastMonth.getDate() + 1);
    }
    return Object.values(dates.value);
  }

  const getData = async () => {
    const res = await StatisticsApi.dailyLoginStat(dates.value[dates.value.length - 1], dates.value[0])
    res.forEach(item => {
      point.value.push(item.loginCount);
    });
    return Object.values(point.value);
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
    const res = await StatisticsApi.visitStat()
    if (res) {
      pastat.value = res
    }
  }

  onMounted(() => {
    createChart();
    load()
  })
</script>

<style lang="scss" scoped></style>
