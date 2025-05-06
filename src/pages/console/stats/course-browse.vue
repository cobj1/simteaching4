<template>
  <div>
    <v-row style="margin-bottom: 20px;">
      <v-toolbar title="课程学习统计">
        <div class="d-flex align-center gap-2" style="justify-content: end; padding: 6px;">
          <v-btn variant="tonal" color="primary" prepend-icon="mdi-microsoft-excel" @click="exportToExcel1">
            导出报表
          </v-btn>
        </div>
      </v-toolbar>
      <v-col>
        <v-card>
          <v-toolbar title="课程学习次数"> </v-toolbar>
          <v-empty-state v-if="empty" icon="mdi-magnify"
            text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
            title="We couldn't find a match."></v-empty-state>
          <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="browseTotal"></canvas></div>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-toolbar title="课程学习时长"> </v-toolbar>
          <v-empty-state v-if="empty" icon="mdi-magnify"
            text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
            title="We couldn't find a match."></v-empty-state>
          <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="timeTotal"></canvas></div>
        </v-card>
      </v-col>
    </v-row>

    <v-row style="margin-bottom: 20px;">
      <v-toolbar title="资源学习统计">
        <div class="d-flex align-center gap-2" style="justify-content: end; padding: 6px;">
          <v-btn variant="tonal" color="primary" prepend-icon="mdi-microsoft-excel" @click="exportToExcel2">
            导出报表
          </v-btn>
        </div>
      </v-toolbar>
      <v-col>
        <v-card>
          <v-toolbar title="资源学习次数"> </v-toolbar>
          <v-empty-state v-if="empty" icon="mdi-magnify"
            text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
            title="We couldn't find a match."></v-empty-state>
          <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="browseCount"></canvas></div>
        </v-card>
      </v-col>
      <v-col style="height: 600px;">
        <v-card>
          <v-toolbar title="资源学习时长"> </v-toolbar>
          <v-empty-state v-if="empty" icon="mdi-magnify"
            text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
            title="We couldn't find a match."></v-empty-state>
          <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="totalTime"></canvas></div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-toolbar title="用户学习统计"> </v-toolbar>
      <v-empty-state v-if="empty" icon="mdi-magnify"
        text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
        title="We couldn't find a match."></v-empty-state>
      <div v-else class="w-100 mx-auto my-4" style="max-width: 800px;"><canvas id="useBrowseTotal"></canvas></div>
    </v-row>
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
  const chartData1 = ref([]);

  const loadItems = async () => {
    const res = await BrowseRecordApi.courseRecords()
    if (res.length > 0) {
      chartData.value = res
      try {
        const data = {
          labels: res.map(item => item.name),
          datasets: [{
            label: '学习次数',
            data: res.map(item => item.browseTotal),
            hoverOffset: 4
          }]
        };
        new Chart(document.getElementById('browseTotal'), {
          type: 'pie',
          data: data,
          options: {
            layout: {
              padding: 20
            }
          }
        });
      } catch (e) {
        /* empty */
      }
      try {
        const data = {
          labels: res.map(item => item.name),
          datasets: [{
            label: '学习时长(分钟)',
            data: res.map(item => parseInt(item.timeTotal / 60)),
            hoverOffset: 4
          }]
        };
        new Chart(document.getElementById('timeTotal'), {
          type: 'pie',
          data: data,
          options: {
            layout: {
              padding: 20
            }
          }
        });
      } catch (e) {
        /* empty */
      }
    } else {
      empty.value = true
    }

    const res1 = await BrowseRecordApi.resourceRecords()
    if (res1.length > 0) {
      try {
        chartData1.value = res1
        const items = [...res1].sort((a, b) => a.browseCount - b.browseCount)
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
        /* empty */
      }
      try {
        const items = [...res1].sort((a, b) => a.totalTime - b.totalTime)
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
        /* empty */
      }
    } else {
      empty.value = true
    }

    const res2 = await BrowseRecordApi.userRecords()
    if (res2.length > 0) {
      try {
        const data = {
          labels: res2.map(item => item.uname),
          datasets: [{
            label: '学习次数',
            data: res2.map(item => item.browseCount),
          },
          {
            label: '学习时长(分钟)',
            data: res2.map(item => parseInt(item.totalTime / 60)),
          }]
        };
        new Chart(document.getElementById('useBrowseTotal'),
          {
            type: 'bar',
            data: data,
            options: {
              layout: {
                padding: 20
              }
            }
          }
        );
      } catch (e) { /* empty */ }
    } else {
      empty.value = true
    }
  }

  const exportToExcel1 = () => {
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
        '课程名称': item.name != '' ? item.name : '空',
        '学习次数': item.browseTotal,
        '学习时长(分钟)': item.timeTotal
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "课程学习统计");
    XLSX.writeFile(workbook, `课程学习统计_${formatDate()}.xlsx`);
  };


  const exportToExcel2 = () => {
    if (chartData1.value.length === 0) return;
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
      chartData1.value.map(item => ({
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
