<template>
  <div class="completion-stats module">

    <h2>虚拟实验完成情况</h2>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>数据加载中...</p>
    </div>
    <!-- 主内容 -->
    <template v-else>
      <div class="parent">

        <selection-org-btn v-model="selectedMajors"></selection-org-btn>
        <v-select label="选择虚拟实验" v-model="selectedLabIds" :items="labItems" item-title="name" item-value="id" multiple
          height="40" item-height="32" ></v-select>

      </div>
      <div class="stats-card">
        <h3>学院实验成绩段分布</h3>
        <div class="score-table-container">
          <table class="score-table">
            <thead>
              <tr>
                <th>实验名称</th>
                <th>60分以下</th>
                <th>60-79分</th>
                <th>80-100分</th>
                <th>平均分</th>
                <th>完成人数</th>
                <th>总人数</th>
                <th>完成比例</th>
                <th>组织</th>
                <th>操作</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(exp, idx) in filteredExperiments" :key="idx">
                <td>{{ exp.name }}</td>
                <td class="low-score">{{ exp.below60 }}</td>
                <td class="medium-score">{{ exp.sixtyTo79 }}</td>
                <td class="high-score">{{ exp.above80 }}</td>
                <td>{{ exp.average }}</td>
                <td>{{ exp.completed_stu }}</td>
                <td>{{ exp.total_stu }}</td>
                <td>{{ exp.completionRate }}</td>
                <td>{{ exp.orgId }}</td>
                <td>
                  <button class="detail-btn" @click="handleViewDetail(exp.orgId,exp.id, exp.name)">
                    查看详情
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 添加详情弹窗组件 -->
      <VirtualLabStatsDetails ref="detailDialog" :orgId="currentorganizationId" :labId="currentLabId"
        :labName="currentLabName" />
    </template>
  </div>
</template>



<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { apiLabService, Lab, Organization, type ExperimentStat } from '@/api/labService';
import VirtualLabStatsDetails from '@/components/chart/VirtualLabStatsDetails.vue';
import { nextTick } from 'vue';
import { watch } from 'vue';






// 数据引用
const majors = ref<Organization[]>([]);
const selectedMajors = ref<string[]>([]);
const labsAll = ref<Lab[]>([]);

const selectedLabIds = ref<string[]>([]);
const experimentScoreData = ref<ExperimentStat[]>([]);
const detailDialog = ref();
const currentorganizationId = ref('');
const currentLabId = ref('');
const currentLabName = ref('');

// 准备v-select需要的items格式
const labItems = computed(() => {
  return labsAll.value.map(lab => ({
    id: lab.id,      // 实际值
    name: lab.name   // 显示文本
  }));
});
// 状态管理
const isLoading = ref(true);

const error = ref<string | null>(null);

// 过滤实验数据
const filteredExperiments = computed(() => {

  return experimentScoreData.value.filter(exp =>

    selectedLabIds.value.length === 0 ||
    selectedLabIds.value.includes(exp.id)
  );
});
watch(selectedMajors, (newVal) => {
  if (newVal.length > 0) {
    currentorganizationId.value = newVal[newVal.length - 1];
    selectExperimentsByorgId(currentorganizationId.value);
    selectLabsByorgId(currentorganizationId.value);
  }
  else
  {
    currentorganizationId.value = ''; // 处理空数组情况
  }
});


//通过组织查询
const selectExperimentsByorgId = async (orgid: string) => {


  const [experimentData] = await Promise.all([

    apiLabService.fetchExperimentStats(orgid).then(experiments => {
      // 为每个实验添加所属组织ID
      return experiments.map(exp => ({
        ...exp,
        orgId: orgid,  // 添加组织ID到实验数据

      }));
    })
  ]);

  experimentScoreData.value = experimentData;

}
//通过组织虚拟实验
const selectLabsByorgId = async (orgid: string) => {


  const [labstData] = await Promise.all([

    apiLabService.fetchLabs(orgid)
  ]);

  labsAll.value = labstData;

}

// 初始化数据
const initData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    // 并行获取所有数据, coursesData, experimentData
    const [college] = await Promise.all([
      apiLabService.fetchColleges(),
    ]);

    majors.value = college;

    // 2. 并行获取多个顶层组织

    const allLabRequests = majors.value.map(major =>
      apiLabService.fetchLabs(major.id)
    );

    const allExperimentRequests = majors.value.map(major =>
      apiLabService.fetchExperimentStats(major.id).then(experiments => {
        // 为每个实验添加所属组织ID
        return experiments.map(exp => ({
          ...exp,
          orgId: major.id,  // 添加组织ID到实验数据

        }));
      })
    );
    // 3. 使用Promise.all并行执行所有请求
    const [allLabResults, allExperimentResults] = await Promise.all([
      Promise.all(allLabRequests),
      Promise.all(allExperimentRequests)
    ]);
    
     // 4. 合并并去重实验室数据
     labsAll.value = allLabResults.flat().filter((lab, index, self) => {
      // 只保留第一个出现的实验室ID
      return index === self.findIndex(l => l.id === lab.id);
    });
   
    experimentScoreData.value = allExperimentResults.flat(); // 合并所有实验数据
    // 5. 可选：按学院组织数据
    // const collegeDataMap = new Map();
    //   majors.value.forEach((major, index) => {
    //     collegeDataMap.set(major.id, {
    //       labs: allLabResults[index],
    //       experiments: allExperimentResults[index]
    //     });
    //   });

  } catch (err) {
    console.error('加载数据失败:', err);
    error.value = '无法加载数据，请稍后重试';
  } finally {
    isLoading.value = false;
  }
};

const handleViewDetail = (orgId: string,labId: string, labName: string) => {
  console.log('查看详情:', labName);

  if (labId) {
    currentLabId.value = labId;
    currentLabName.value = labName;
    currentorganizationId.value=orgId;
  
    nextTick(() => {
      detailDialog.value?.open();
    });
  }
};

// 组件挂载时加载数据
onMounted(initData);
</script>

<!-- 模板和样式部分保持不变 -->
<style scoped>
/* 样式实现 */
.completion-stats {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.parent {
  display: flex;
  /* 水平方向上的对齐方式，这里设置为居中对齐，可根据需求修改 */
  justify-content: center;
  /* 垂直方向上的对齐方式，这里设置为居中对齐，可根据需求修改 */
  align-items: center;

}

.stats-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.score-table-container {
  display: flex;
  overflow-y: auto;
}

.score-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.low-score {
  color: #f56c6c;
}

.medium-score {
  color: #e6a23c;
}

.high-score {
  color: #67c23a;
}

:deep(.v-input) {
  display: flex;
  /* 其他可能的网格布局属性，如定义网格区域 */
  grid-template-areas: "messages";

}

:deep(.v-input__details) {
  grid-area: messages !important;
}

:deep(.v-input__control) {
  min-width: 300px;
}


.card.warning {
  border-left-color: #e74c3c;
}

.card-title {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
}

.trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 8px;
}

.trend.up {
  color: #10b981;
}

.trend.down {
  color: #ef4444;
}

.icon-up,
.icon-down,
.icon-warning {
  margin-right: 4px;
}

.chart-area {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
}

.ranking-table {
  flex: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #f8fafc;
  font-weight: 500;
  color: #64748b;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
}

.detail-btn,
.remind-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.detail-btn {
  background: #e0f2fe;
  color: #0369a1;
  border: none;
}

.remind-btn {
  background: #fee2e2;
  color: #b91c1c;
  border: none;
}

.remind-btn:disabled {
  background: #e2e8f0;
  color: #64748b;
  cursor: not-allowed;
}
</style>