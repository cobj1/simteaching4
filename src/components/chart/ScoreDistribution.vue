<template>
  <!-- 成绩分布组件 -->
  <div class="score-distribution module">
    <h2>学院实验成绩段分布</h2>

    <div class="chart-group">
      <!-- <div class="chart-container">
        <ScoreBarChart :data="props.distribution.chartData" @select="props.handleScoreSelect" />
      </div>

      <div class="chart-container">
        <ClassComparisonChart :data="props.comparison.data" :selectedClasses="props.comparison.selectedClasses"
          @classChange="props.handleClassChange" />
      </div> -->
    </div>

    <div class="score-table">
      <h3>实验成绩统计表</h3>
      <table>
        <thead>
          <tr>
            <th>实验名称</th>
            <th>院系名称</th>
            <th>60分以下</th>
            <th>60-79分</th>
            <th>80-100分</th>
            <th>平均分</th>
            <th>标准差</th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr v-for="(item, index) in props.scoreTable" :key="index">
            <td>{{ item.experimentName }}</td>
            <td>{{ item.department }}</td>
            <td class="low-score">{{ item.below60 }}</td>
            <td class="medium-score">{{ item.sixtyTo79 }}</td>
            <td class="high-score">{{ item.above80 }}</td>
            <td>{{ item.average.toFixed(1) }}</td>
            <td>{{ item.standardDeviation.toFixed(1) }}</td>
          </tr> -->
          <tr v-for="index in 6" :key="index">
            <td>测试</td>
            <td>index</td>
            <td class="low-score">60</td>
            <td class="medium-score">70</td>
            <td class="high-score">90</td>
            <td>index</td>
            <td>index</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">

/* import ScoreBarChart from './ScoreBarChart.vue'; */
// import { ScoreDistributionData, ScoreTableItem } from '@/stores/labStats';


// const props = defineProps<{
//   distribution: ScoreDistributionData['distribution']
//   comparison: ScoreDistributionData['comparison']
//   scoreTable: ScoreTableItem[]
// }>()
/*
const handleScoreSelect = (scoreRange: string) => {
  console.log('选择了分数段:', scoreRange)
}

const handleClassChange = (classes: string[]) => {
  console.log('班级选择变化:', classes)
} */
</script>

<style scoped>
/* 样式实现 */
</style>
