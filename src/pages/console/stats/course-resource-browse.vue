<template>
  <div>
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
import { BrowseRecordApi } from '@/api/browse-record';
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto'

const empty = ref(false)

const loadItems = async () => {
  let res = await BrowseRecordApi.resourceRecords()
  if (res.length > 0) {
    try {
      const items = [...res].sort((a, b) => a.browseCount - b.browseCount)
      const data = {
        labels: items.map(item => item.name),
        datasets: [{
          label: '学习次数',
          data: items.map(item => item.browseCount),
          hoverOffset: 4
        }]
      };
      new Chart(document.getElementById('browseCount'),
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
      const items = [...res].sort((a, b) => a.totalTime - b.totalTime)
      const data = {
        labels: items.map(item => item.name),
        datasets: [{
          label: '学习时长(分钟)',
          data: items.map(item => parseInt(item.totalTime / 60)),
          hoverOffset: 4
        }]
      };
      new Chart(document.getElementById('totalTime'),
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
