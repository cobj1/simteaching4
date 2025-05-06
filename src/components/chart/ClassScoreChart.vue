<template>
  <div ref="chartRef" class="class-score-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'

const props = defineProps<{
  data: {
    className: string
    below60: number
    sixtyTo79: number
    above80:number
  }[]
}>()


const emit = defineEmits(['class-selected'])

const chartRef = ref<HTMLElement>()
let chart: ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  updateChart()
}

const updateChart = () => {
  if (!chart || !props.data.length) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['不及格', '中等','优秀']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      max: 100
    },
    yAxis: {
      type: 'category',
      data: props.data.map(item => item.className)
    },
    series: [
      {
        name: '不及格',
        type: 'bar',
        data: props.data.map(item => item.below60),
        itemStyle: {
          color: '#5470c6'
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}分'
        }
      },
      {
        name: '中等',
        type: 'bar',
        data: props.data.map(item => item.sixtyTo79),
        itemStyle: {
          color: '#ADD8E6'
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}分'
        }
      },
      {
        name: '优秀',
        type: 'bar',
        data: props.data.map(item => item.above80),
        itemStyle: {
          color: '#91cc75'
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}分'
        }
      }
    ]
  }

  chart.setOption(option)
  
  // 添加点击事件
  chart.on('click', (params: any) => {
    if (params.componentType === 'series') {
      emit('class-selected', props.data[params.dataIndex].className)
    }
  })
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart?.resize())
})

watch(() => props.data, () => {
  updateChart()
}, { deep: true })
</script>

<style scoped>
.class-score-chart {
  width: 100%;
  height: 400px;
}


</style>