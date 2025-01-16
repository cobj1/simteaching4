<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="i in 10" :key="i">
        <v-card>
          <v-toolbar title="资源学习次数"> </v-toolbar>
          <canvas :id="'myChart' + i"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2" v-for="i in 10" :key="i">
        <v-card>
          <v-toolbar title="资源学习次数"> </v-toolbar>
          <canvas :id="'bar' + i"></canvas>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script setup>
import { Chart } from 'chart.js/auto';
import { onMounted } from 'vue';

const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
};

const config = {
  type: 'pie',
  data: data,
};


const config2 = {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
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

onMounted(() => {

  for (let i = 1; i <= 10; i++) {
    const ctx = document.getElementById('myChart' + i);
    new Chart(ctx, config);
  }

  for (let i = 1; i <= 10; i++) {
    const ctx = document.getElementById('bar' + i);
    new Chart(ctx, config2);
  }
})
</script>

<style lang="scss" scoped></style>
