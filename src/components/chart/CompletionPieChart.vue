<template>
    <div ref="chartRef" class="completion-pie-chart"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
  import * as echarts from 'echarts'
  import type { ECharts } from 'echarts'
  
  interface Props {
    data: {
      completed: number
      uncompleted: number
    }
  }
  
  const props = defineProps<Props>()
  
  const emit = defineEmits<{
    (e: 'click', type: 'completed' | 'uncompleted'): void
  }>()
  
  const chartRef = ref<HTMLElement>()
  let chart: ECharts | null = null
  
  const initChart = () => {
    if (!chartRef.value) return
    
    chart = echarts.init(chartRef.value)
    updateChart()
  }
  
  const updateChart = () => {
    if (!chart) return
  
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['已完成', '未完成']
      },
      series: [
        {
          name: '完成情况',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              formatter: '{b}: {c}人\n{d}%'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: props.data.completed,
              name: '已完成',
              itemStyle: { color: '#36a2eb' }
            },
            {
              value: props.data.uncompleted,
              name: '未完成',
              itemStyle: { color: '#ff6384' }
            }
          ]
        }
      ]
    }
  
    chart.setOption(option)
    
    // 添加点击事件
    chart.on('click', (params: any) => {
      if (params.dataIndex === 0) {
        emit('click', 'completed')
      } else {
        emit('click', 'uncompleted')
      }
    })
  }
  
  const resizeChart = () => {
    chart?.resize()
  }
  
  onMounted(() => {
    initChart()
    window.addEventListener('resize', resizeChart)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart)
    chart?.dispose()
  })
  
  watch(() => props.data, () => {
    updateChart()
  }, { deep: true })
  </script>
  
  <style scoped>
  .completion-pie-chart {
    width: 100%;
    height: 400px;
  }
  </style>