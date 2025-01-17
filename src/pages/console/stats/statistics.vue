<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="学校数据统计"> </v-toolbar>
          <canvas id="myChart1"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="学院学生数量"> </v-toolbar>
          <canvas id="myChart2"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="学院教师数量"> </v-toolbar>
          <canvas id="myChart3"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="专业学生数量"> </v-toolbar>
          <canvas id="myChart4"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="专业教师数量"> </v-toolbar>
          <canvas id="myChart5"></canvas>
        </v-card>
      </v-col>

     <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="班级学生数量"> </v-toolbar>
          <canvas id="myChart6"></canvas>
        </v-card>
      </v-col>

     <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="班级教师数量"> </v-toolbar>
          <canvas id="myChart7"></canvas>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script setup>
  import {
    Chart
  } from 'chart.js/auto';
  import {
    onMounted
  } from 'vue';

  const data = {
    labels: [
      '学院数量',
      '专业数量',
      '班级数量',
      '教师数量',
      '学生数量'
    ],
    datasets: [{
      label: '数量',
      data: [3, 3, 3, 45, 300],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)'
      ],
      hoverOffset: 4
    }]
  };

  const data1 = {
    labels: [
      '学院',
      '研发部',
      '数学科学院'
    ],
    datasets: [{
      label: '学生数量',
      data: [70, 130, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  const data2 = {
    labels: [
      '学院',
      '研发部',
      '数学科学院'
    ],
    datasets: [{
      label: '教师数量',
      data: [5, 25, 15],
      backgroundColor: [
        'rgb(255, 0, 255)',
        'rgb(170, 170, 255)',
        'rgb(255, 255, 0)'
      ],
      hoverOffset: 4
    }]
  };

 const data3 = {
    labels: [
      '专业',
      '开发部',
      '设计部',
      '数学专业'
    ],
    datasets: [{
      label: '学生数量',
      data: [2, 80, 115, 103],
      backgroundColor: [
        'rgb(255, 0, 255)',
        'rgb(170, 170, 255)',
        'rgb(255, 255, 0)',
        'rgb(54, 162, 235)'
      ],
      hoverOffset: 4
    }]
  };

 const data4 = {
    labels: [
      '专业',
      '开发部',
      '设计部',
      '数学专业'
    ],
    datasets: [{
      label: '教师数量',
      data: [2, 25, 13, 5],
      backgroundColor: [
        'rgb(255, 0, 255)',
        'rgb(170, 170, 255)',
        'rgb(255, 255, 0)',
        'rgb(54, 162, 235)'
      ],
      hoverOffset: 4
    }]
  };

 const data5 = {
    labels: [
      '班级',
      '开发部'
    ],
    datasets: [{
      label: '学生数量',
      data: [10, 180],
      backgroundColor: [
        'rgb(255, 0, 255)',
        'rgb(170, 170, 255)'
      ],
      hoverOffset: 4
    }]
  };

 const data6 = {
    labels: [
      '班级',
      '开发部'
    ],
    datasets: [{
      label: '教师数量',
      data: [5, 12],
      backgroundColor: [
        'rgb(255, 255, 0)',
        'rgb(54, 162, 235)'
      ],
      hoverOffset: 4
    }]
  };

  const config = {
    type: 'pie',
    data: data,
  };

  const config1 = {
    type: 'pie',
    data: data1,
  };

  const config2 = {
    type: 'pie',
    data: data2,
  };

  const config3 = {
    type: 'pie',
    data: data3,
  };

  const config4 = {
    type: 'pie',
    data: data4,
  };

  const config5 = {
    type: 'pie',
    data: data5,
  };

  const config6 = {
    type: 'pie',
    data: data6,
  };

  onMounted(() => {

    const ctx = document.getElementById('myChart1');
    new Chart(ctx, config);

    const ctx1 = document.getElementById('myChart2');
    new Chart(ctx1, config1);

    const ctx2 = document.getElementById('myChart3');
    new Chart(ctx2, config2);

    const ctx3 = document.getElementById('myChart4');
    new Chart(ctx3, config3);

    const ctx4 = document.getElementById('myChart5');
    new Chart(ctx4, config4);

    const ctx5 = document.getElementById('myChart6');
    new Chart(ctx5, config5);

    const ctx6 = document.getElementById('myChart7');
    new Chart(ctx6, config6);

  })
</script>

<style lang="scss" scoped></style>
