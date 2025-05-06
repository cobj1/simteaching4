<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="virtual-lab-stats">
      <!-- 学生使用情况排名 -->
      <div class="stats-section">
        <div class="modal-header">
          <h2>使用情况:<br>{{ labName }}</h2>
          
          <button class="close-btn" @click="close">×</button>
        </div>
        <div class="tabs">
          <button class="tab-btn" :class="{ active: activeTab === 'duration' }" @click="activeTab = 'duration'">
            使用时长排名
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'frequency' }" @click="activeTab = 'frequency'">
            使用次数排名
          </button>
        </div>

        <div class="ranking-container">
          <UsageRanking :type="activeTab" :data="activeTab === 'duration' ? durationRanking : frequencyRanking" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import UsageRanking from '@/components/chart/UsageRanking.vue'

import { apiLabService, ExperimentStat_Stu } from '@/api/labService';



const props = defineProps<{
  orgId: string
  labId: string
  labName: string
}>()

// 默认关闭状态
const visible = ref(false)

// 打开弹窗的方法
const open =async () => {
  visible.value = true;
  await initData(); // 打开时初始化数据
}

// 关闭弹窗的方法
const close = () => {
  visible.value = false
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})

const experiment = ref<ExperimentStat_Stu[]>([]);
  const durationRanking = ref<any[]>([])
    const frequencyRanking = ref<any[]>([])
// 初始化数据
const initData = async () => {
  try {



    const [allExperimentRequests_Stu] = await Promise.all([
      apiLabService.fetchExperimentStats_Stu(props.orgId, props.labId)
    ]);

    console.log("学生实验数据", allExperimentRequests_Stu);

     experiment.value = allExperimentRequests_Stu; // 合并所有实验数据

     // 转换数据格式
    if (experiment.value && experiment.value.length > 0) {
   
       // 使用时长排名（根据totalTime）
       durationRanking.value = experiment.value
        .sort((a, b) => parseFloat(b.totalTime) - parseFloat(a.totalTime))
        .map((item, index) => ({
          rank: index + 1,
          name: item.user_name,
          studentId: item.user_id,
          score: item.score,
          duration: formatTime(parseFloat(item.totalTime)),
          orignazion: item.org_names || '未知学院',
          // className: '' // 根据实际情况添加班级信息
        }))

        // 使用次数排名（根据totalCount）
      frequencyRanking.value = experiment.value
        .sort((a, b) => parseInt(b.totalCount) - parseInt(a.totalCount))
        .map((item, index) => ({
          rank: index + 1,
          name: item.user_name,
          studentId: item.user_id,
          score: item.score,
          frequency: item.totalCount,
          orignazion: item.org_names || '未知学院',
          // className: '' // 根据实际情况添加班级信息
        }))
      }


  } catch (err) {
    console.error('加载数据失败:', err);

  } finally {

  }
};

// 将秒数转换为 hh:mm:ss 格式
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  
  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].join(':')
}


const activeTab = ref<'duration' | 'frequency'>('duration')
</script>

<style scoped>
/* 新增的弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #409eff;
}

/* 修改原有样式 */
.virtual-lab-stats {
  background: #fff;
  border-radius: 8px;
  width: 80%;
  max-width: 1500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stats-section {
  background: transparent;
  padding: 0;
  box-shadow: none;
}

h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

/* 保留原有的tabs和ranking-container样式 */
.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.tab-btn {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  position: relative;
}

.tab-btn.active {
  color: #409eff;
  font-weight: bold;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #409eff;
}

.ranking-container {
  margin-top: 15px;
  overflow-x: auto;
}
</style>