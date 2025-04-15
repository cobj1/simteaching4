<template>
  <div class="d-flex flex-column gap-4">
    <v-card border flat>
      <v-container fluid class="pa-4">
        <v-row dense>
          <template v-for="(item, index) in statsItems" :key="index">
            <v-col cols="12" md="3" sm="6" class="d-flex border-b">
              <v-sheet class="pa-3 flex-grow-1 d-flex align-center" :class="index % 2 === 0 ? 'surface-light' : ''">
                <span class="text-caption font-weight-medium">{{ item.label }}</span>
                <v-spacer />
                <span class="text-body-1">{{ item.value }}</span>
              </v-sheet>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card>
    <v-card border flat>
      <v-toolbar color="surface" density="compact">
        <v-toolbar-title class="text-body-1 font-weight-bold">每日登录情况</v-toolbar-title>
        <template #append>
          <div class="d-flex align-center gap-2">
            <!-- <v-date-input hide-details v-model="dateRange" label="选择范围" style="width: 280px;" multiple="range"
              class="ma-2 flex-1-1" @update:options="fetchChartData"></v-date-input> -->
            <v-btn variant="tonal" color="primary" prepend-icon="mdi-microsoft-excel" @click="exportToExcel">
              导出报表
            </v-btn>
          </div>
        </template>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <div class="chart-container">
              <canvas id="line"></canvas>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script setup>
  import {
    onMounted,
    ref,
    computed,
    watch
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
  import * as XLSX from 'xlsx';

  const getDateString = (date) => {
    const d = date instanceof Date ? date : new Date();
    if (typeof date === 'number') d.setDate(d.getDate() + date);
    return d.toISOString().split('T')[0];
  };
  // 响应式状态
  const dateRange = ref([getDateString(-30), getDateString(0)]); // 默认显示最近30天
  const pastat = ref({});
  const chartData = ref([]);
  let chartInstance = null; // 图表实例引用

  const statsItems = computed(() => [{
      label: '平台总访问量（次）',
      value: pastat.value.totalCount?.toLocaleString() || '0'
    },
    {
      label: '本周访问量',
      value: pastat.value.weeklyCount?.toLocaleString() || '0'
    },
    {
      label: '学生用户量',
      value: pastat.value.stuCount?.toLocaleString() || '0'
    },
    {
      label: '教师用户量',
      value: pastat.value.teaCount?.toLocaleString() || '0'
    },
    {
      label: '使用时长',
      value: pastat.value.useTime?.toLocaleString() || '0'
    },
    {
      label: '当前在线人数',
      value: pastat.value.onlineTime?.toLocaleString() || '0'
    }
  ]);

 /* watch(dateRange, (newVal) => {
    if (newVal && newVal.length === 2) {
      renderChart();
    }
  }); */

  onMounted(async () => {
    await loadStatistics();
    await renderChart();
  });

  const loadStatistics = async () => {
    try {
      const res = await StatisticsApi.visitStat();
      pastat.value = res || {};
    } catch (error) {
      console.error('加载统计概览失败:', error);
    }
  };

  const renderChart = async () => {
    try {
      destroyChart();
     /* if (dateRange.value) {
        dateRange.value = [getDateString(-30), getDateString(0)]
      } */
      const [startDate, endDate] = dateRange.value;
      const {
        labels,
        dataValues
      } = await fetchChartData(startDate, endDate);

      chartData.value = labels.map((date, index) => ({
        date,
        value: dataValues[index]
      }));

      const ctx = document.getElementById('line').getContext('2d');
      chartInstance = new Chart(ctx, getChartConfig(labels, dataValues));
    } catch (error) {
      console.error('渲染图表失败:', error);
    }
  };

  const fetchChartData = async (start, end) => {
    try {
      /* console.log(start + " , " + end) */
      const dateList = generateDateArray(start, end);
      const apiData = await StatisticsApi.dailyLoginStat(start, end);
      const dataMap = new Map(apiData.map(item => [
        item.date, item.loginCount
      ]));
      const dataValues = dateList.map(date =>
        dataMap.get(date) || 0
      );
      return {
        labels: dateList,
        dataValues
      };
    } catch (error) {
      console.error('获取图表数据失败:', error);
      return {
        labels: [],
        dataValues: []
      };
    }
  };

  // 生成日期数组（支持跨月）
  const generateDateArray = (start, end) => {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      dates.push(getDateString(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const getChartConfig = (labels, data) => ({
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '登录人次',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'yyyy-MM-dd'
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });

  const destroyChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  };

  const exportToExcel = () => {
    if (chartData.value.length === 0) return;
    // 生成YYYYmmddhhmmss格式日期
    const formatDate = (date = new Date()) => {
      const pad = (n) => n.toString().padStart(2, '0') // 补零函数
      return [
        date.getFullYear(),
        pad(date.getMonth() + 1), // 月份从0开始需+1
        pad(date.getDate()),
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
      ].join('') // 输出示例：20240624153507
    }
    const worksheet = XLSX.utils.json_to_sheet(
      chartData.value.map(item => ({
        '日期': item.date,
        '登录人次': item.value
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "登录统计");
    XLSX.writeFile(workbook, `登录统计_${formatDate()}.xlsx`);
  };
</script>

<style lang="scss" scoped>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
  }

  .border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  @media (min-width: 960px) {
    .border-b {
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      border-bottom: none !important;
    }
  }

  .surface-light {
    background-color: rgb(var(--v-theme-surface-light)) !important;
  }
</style>
