<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="角色登录次数"> </v-toolbar>
          <canvas id="myChart1"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="管理员点击次数"> </v-toolbar>
          <canvas id="myChart2"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="校级管理员点击次数"> </v-toolbar>
          <canvas id="myChart3"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="院级管理员点击次数"> </v-toolbar>
          <canvas id="myChart4"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="教务处点击次数"> </v-toolbar>
          <canvas id="myChart5"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="教师点击次数"> </v-toolbar>
          <canvas id="myChart6"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="学生点击次数"> </v-toolbar>
          <canvas id="myChart7"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="管理员单次最长停留时间"> </v-toolbar>
          <canvas id="myChart8"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="校级管理员单次最长停留时间"> </v-toolbar>
          <canvas id="myChart9"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="院级管理员单次最长停留时间"> </v-toolbar>
          <canvas id="myChart10"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="教务处单次最长停留时间"> </v-toolbar>
          <canvas id="myChart11"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="教师单次最长停留时间"> </v-toolbar>
          <canvas id="myChart12"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="学生单次最长停留时间"> </v-toolbar>
          <canvas id="myChart13"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="管理员累积停留时间"> </v-toolbar>
          <canvas id="myChart14"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="校级管理员累积停留时间"> </v-toolbar>
          <canvas id="myChart15"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="院级管理员累积停留时间"> </v-toolbar>
          <canvas id="myChart16"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="教务处累积停留时间"> </v-toolbar>
          <canvas id="myChart17"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="教师累积停留时间"> </v-toolbar>
          <canvas id="myChart18"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="学生累积停留时间"> </v-toolbar>
          <canvas id="myChart19"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="登录设备次数"> </v-toolbar>
          <canvas id="bar1"></canvas>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card>
          <v-toolbar title="登录浏览器次数"> </v-toolbar>
          <canvas id="bar2"></canvas>
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
      '管理员',
      '校级管理员',
      '院级管理员',
      '教务处',
      '教师',
      '学生'
    ],
    datasets: [{
      label: '登录次数',
      data: [41, 62, 42, 62, 100, 235],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)'
      ],
      hoverOffset: 4
    }]
  };

  const data1 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '点击次数',
      data: [1, 2, 2, 2, 0, 5, 5, 2, 2, 0, 5, 5, 2, 2, 0, 5, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data2 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '点击次数',
      data: [1, 5, 2, 2, 4, 5, 5, 2, 2, 3, 5, 5, 1, 2, 2, 5, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data3 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '点击次数',
      data: [10, 15, 2, 20, 4, 5, 4, 2, 5, 7, 3, 5, 5, 9, 2, 2, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data4 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '点击次数',
      data: [4, 6, 2, 4, 4, 5, 4, 2, 5, 37, 3, 5, 7, 2, 3, 2, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data5 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '点击次数',
      data: [24, 6, 2, 24, 4, 15, 4, 2, 5, 17, 13, 50, 7, 2, 3, 2, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data6 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '点击次数',
      data: [24, 0, 0, 24, 0, 15, 14, 12, 0, 0, 0, 0, 0, 0, 0, 0, 60],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data7 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '单次最长停留时间/分',
      data: [1, 20, 20, 2, 0, 50, 5, 2, 20, 0, 25, 15, 2, 2, 0, 15, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data8 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '单次最长停留时间/分',
      data: [1, 50, 20, 20, 4, 50, 50, 20, 20, 30, 5, 5, 10, 20, 2, 50, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data9 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '单次最长停留时间/分',
      data: [10, 15, 2, 20, 4, 59, 4, 29, 5, 47, 30, 5, 25, 19, 22, 2, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data10 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '单次最长停留时间/分',
      data: [14, 16, 12, 14, 42, 5, 4, 2, 5, 37, 13, 5, 17, 12, 13, 12, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data11 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '单次最长停留时间/分',
      data: [24, 6, 2, 24, 4, 15, 4, 12, 15, 17, 13, 50, 7, 2, 3, 2, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data12 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '单次最长停留时间/分',
      data: [240, 0, 0, 240, 0, 150, 14, 120, 0, 0, 0, 0, 0, 0, 0, 0, 760],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data13 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '累积停留时间/分',
      data: [1, 20, 20, 2, 0, 50, 5, 2, 20, 0, 25, 15, 2, 2, 0, 15, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data14 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '累积停留时间/分',
      data: [1, 50, 20, 20, 4, 50, 50, 20, 20, 30, 5, 5, 10, 20, 2, 50, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data15 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '累积停留时间/分',
      data: [10, 15, 2, 20, 4, 59, 4, 29, 5, 47, 30, 5, 25, 19, 22, 2, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data16 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '累积停留时间/分',
      data: [14, 16, 12, 14, 42, 5, 4, 2, 5, 37, 13, 5, 17, 12, 13, 12, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data17 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '累积停留时间/分',
      data: [24, 6, 2, 24, 4, 15, 4, 12, 15, 17, 13, 50, 7, 2, 3, 2, 5],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const data18 = {
    labels: [
      '首页', '课程管理', '课程审核', '资源库', '共享资源',
      '考勤登录', '签到管理', '通知公告', '门户管理', '组织管理',
      '用户管理', '试用管理', '统计中心', '系统数据', '申报管理',
      '申报审核', '仿真课程'
    ],
    datasets: [{
      label: '累积停留时间/分',
      data: [240, 0, 0, 240, 0, 150, 14, 120, 0, 0, 0, 0, 0, 0, 0, 0, 760],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(170, 85, 255)',
        'rgb(170, 255, 127)',
        'rgb(170, 170, 255)',
        'rgb(93, 255, 196)',
        'rgb(255, 85, 0)',
        'rgb(255, 255, 127)',
        'rgb(170, 170, 127)',
        'rgb(255, 157, 242)',
        'rgb(255, 206, 183)',
        'rgb(124, 184, 235)',
        'rgb(153, 153, 0)',
        'rgb(145, 145, 145)',
        'rgb(111, 165, 82)',
        'rgb(255, 24, 143)'
      ],
      hoverOffset: 4
    }]
  };

  const config = {
    type: 'pie',
    data: data,
  };

  const config3 = {
    type: 'pie',
    data: data1,
  };

  const config4 = {
    type: 'pie',
    data: data2,
  };

  const config5 = {
    type: 'pie',
    data: data3,
  };

  const config6 = {
    type: 'pie',
    data: data4,
  };

  const config7 = {
    type: 'pie',
    data: data5,
  };

  const config8 = {
    type: 'pie',
    data: data6,
  };

  const config9 = {
    type: 'pie',
    data: data7,
  };

  const config10 = {
    type: 'pie',
    data: data8,
  };

  const config11 = {
    type: 'pie',
    data: data9,
  };

  const config12 = {
    type: 'pie',
    data: data10,
  };

  const config13 = {
    type: 'pie',
    data: data11,
  };

  const config14 = {
    type: 'pie',
    data: data12,
  };

  const config15 = {
    type: 'pie',
    data: data13,
  };

  const config16 = {
    type: 'pie',
    data: data14,
  };

  const config17 = {
    type: 'pie',
    data: data15,
  };

  const config18 = {
    type: 'pie',
    data: data16,
  };

  const config19 = {
    type: 'pie',
    data: data17,
  };

  const config20 = {
    type: 'pie',
    data: data18,
  };

  const config1 = {
    type: 'bar',
    data: {
      labels: ['Windows', 'IOS'],
      datasets: [{
        label: '设备',
        data: [232, 119],
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

  const config2 = {
    type: 'bar',
    data: {
      labels: ['百度', '搜狐', '谷歌', '360浏览器'],
      datasets: [{
        label: '使用的浏览器',
        data: [82, 19, 119, 72],
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

    const ctx = document.getElementById('myChart1');
    new Chart(ctx, config);

    const ctx3 = document.getElementById('myChart2');
    new Chart(ctx3, config3);

    const ctx4 = document.getElementById('myChart3');
    new Chart(ctx4, config4);

    const ctx5 = document.getElementById('myChart4');
    new Chart(ctx5, config5);

    const ctx6 = document.getElementById('myChart5');
    new Chart(ctx6, config6);

    const ctx7 = document.getElementById('myChart6');
    new Chart(ctx7, config7);

    const ctx8 = document.getElementById('myChart7');
    new Chart(ctx8, config8);

    const ctx9 = document.getElementById('myChart8');
    new Chart(ctx9, config9);

    const ctx10 = document.getElementById('myChart9');
    new Chart(ctx10, config10);

    const ctx11 = document.getElementById('myChart10');
    new Chart(ctx11, config11);

    const ctx12 = document.getElementById('myChart11');
    new Chart(ctx12, config12);

    const ctx13 = document.getElementById('myChart12');
    new Chart(ctx13, config13);

    const ctx14 = document.getElementById('myChart13');
    new Chart(ctx14, config14);

    const ctx15 = document.getElementById('myChart14');
    new Chart(ctx15, config15);

    const ctx16 = document.getElementById('myChart15');
    new Chart(ctx16, config16);

    const ctx17 = document.getElementById('myChart16');
    new Chart(ctx17, config17);

    const ctx18 = document.getElementById('myChart17');
    new Chart(ctx18, config18);

    const ctx19 = document.getElementById('myChart18');
    new Chart(ctx19, config19);

    const ctx20 = document.getElementById('myChart19');
    new Chart(ctx20, config20);

    const ctx1 = document.getElementById('bar1');
    new Chart(ctx1, config1);

    const ctx2 = document.getElementById('bar2');
    new Chart(ctx2, config2);

  })
</script>

<style lang="scss" scoped></style>
