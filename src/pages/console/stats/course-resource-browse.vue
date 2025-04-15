<template>
  <div>
    <div class="d-flex align-center gap-2" style="justify-content: end; padding: 6px;">
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-microsoft-excel" @click="exportToExcel">
        导出报表
      </v-btn>
    </div>
    <v-card>
      <v-toolbar title="资源学习次数"> </v-toolbar>
      <v-empty-state v-if="empty" icon="mdi-magnify"
        text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
        title="We couldn't find a match."></v-empty-state>
      <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="browseCount"></canvas></div>
    </v-card>
    <v-card class="mt-4">
      <v-toolbar title="资源学习时长"> </v-toolbar>
      <v-empty-state v-if="empty" icon="mdi-magnify"
        text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
        title="We couldn't find a match."></v-empty-state>
      <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="totalTime"></canvas></div>
    </v-card>
  </div>
</template>

<script setup>
  import {
    BrowseRecordApi
  } from '@/api/browse-record';
  import {
    onMounted,
    ref
  } from 'vue';
  import Chart from 'chart.js/auto'
  import * as XLSX from 'xlsx';

  const empty = ref(false)
  const chartData = ref([]);

  const loadItems = async () => {
    let res = await BrowseRecordApi.resourceRecords()
    if (res.length > 0) {
      try {
        chartData.value = res
        const items = [...res].sort((a, b) => a.browseCount - b.browseCount)
        const data = {
          labels: items.map(item => item.name),
          datasets: [{
            label: '学习次数',
            data: items.map(item => item.browseCount),
            hoverOffset: 4
          }]
        };
        new Chart(document.getElementById('browseCount'), {
          type: 'pie',
          data: data,
          options: {
            layout: {
              padding: 20
            }
          }
        });
      } catch (e) {
        /* empty */ }
      try {
        const items = [...res].sort((a, b) => a.totalTime - b.totalTime)
        const data = {
          labels: items.map(item => item.name),
          datasets: [{
            label: '学习时长(分钟)',
            data: items.map(item => parseInt(item.totalTime / 60)),
            hoverOffset: 4
          }]
        };
        new Chart(document.getElementById('totalTime'), {
          type: 'pie',
          data: data,
          options: {
            layout: {
              padding: 20
            }
          }
        });
      } catch (e) {
        /* empty */ }
    } else {
      empty.value = true
    }
  }

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
    console.log(chartData.value)
    const worksheet = XLSX.utils.json_to_sheet(
      chartData.value.map(item => ({
        '资源名称': item.name,
        '学习次数': item.browseCount,
        '学习时长(分钟)': item.totalTime
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "资源学习统计");
    XLSX.writeFile(workbook, `资源学习统计_${formatDate()}.xlsx`);
  };

  onMounted(() => {
    loadItems()
  })
</script>

<style scoped></style>
