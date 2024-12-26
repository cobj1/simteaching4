<template>
  <div>
    <v-card>
      <v-toolbar title="课程学习次数"> </v-toolbar>
      <v-empty-state v-if="empty" icon="mdi-magnify"
        text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
        title="We couldn't find a match."></v-empty-state>
      <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="browseTotal"></canvas></div>
    </v-card>
    <v-card class="mt-4">
      <v-toolbar title="课程学习时长"> </v-toolbar>
      <v-empty-state v-if="empty" icon="mdi-magnify"
        text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
        title="We couldn't find a match."></v-empty-state>
      <div v-else class="w-100 mx-auto my-4" style="max-width: 500px;"><canvas id="timeTotal"></canvas></div>
    </v-card>
  </div>
</template>

<script setup>
import { BrowseRecordApi } from '@/api/browse-record';
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto'

const empty = ref(false)

const loadItems = async () => {
  const res = await BrowseRecordApi.courseRecords()
  console.log(res)
  if (res.length > 0) {
    try {
      const data = {
        labels: res.map(item => item.name),
        datasets: [{
          label: '学习次数',
          data: res.map(item => item.browseTotal),
          hoverOffset: 4
        }]
      };
      new Chart(document.getElementById('browseTotal'),
        {
          type: 'pie',
          data: data,
          options: {
            layout: {
              padding: 20
            }
          }
        }
      );
    } catch (e) { /* empty */ }
    try {
      const data = {
        labels: res.map(item => item.name),
        datasets: [{
          label: '学习时长(分钟)',
          data: res.map(item => parseInt(item.timeTotal / 60)),
          hoverOffset: 4
        }]
      };
      new Chart(document.getElementById('timeTotal'),
        {
          type: 'pie',
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

onMounted(() => {
  loadItems()
})
</script>

<style scoped></style>
