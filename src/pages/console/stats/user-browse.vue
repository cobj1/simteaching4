<template>
  <div>
    <v-card>
      <v-toolbar title="课程学习次数"> </v-toolbar>
      <v-empty-state v-if="empty" icon="mdi-magnify"
        text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
        title="We couldn't find a match."></v-empty-state>
      <div v-else class="w-100 mx-auto my-4" style="max-width: 800px;"><canvas id="browseTotal"></canvas></div>
    </v-card>
  </div>
</template>

<script setup>
import { BrowseRecordApi } from '@/api/browse-record';
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto'

const empty = ref(false)

const loadItems = async () => {
  const res = await BrowseRecordApi.userRecords()
  if (res.length > 0) {
    try {
      const data = {
        labels: res.map(item => item.uname),
        datasets: [{
          label: '学习次数',
          data: res.map(item => item.browseCount),
        },
        {
          label: '学习时长(分钟)',
          data: res.map(item => parseInt(item.totalTime / 60)),
        }]
      };
      new Chart(document.getElementById('browseTotal'),
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

onMounted(() => {
  loadItems()
})
</script>

<style scoped></style>
