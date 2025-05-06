<template>
  <div class="usage-ranking-container">
    <!-- 组织关键字搜索 -->
    <div class="search-container">
      <el-input
        v-model="searchKeyword"
        placeholder="输入组织名称关键字"
        clearable
        style="width: 300px"
        @clear="handleClearSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 排名表格 -->
    <el-table
      :data="filteredData"
      style="width: 100%"
      height="500"
      border
      stripe
      v-loading="isLoading"
    >
      <el-table-column
        v-if="type === 'duration'"
        prop="duration"
        label="总时长(分钟)"
        sortable
        width="120"
      />
      <el-table-column
        v-if="type === 'frequency'"
        prop="frequency"
        label="实验次数"
        sortable
        width="120"
      />
      <el-table-column prop="rank" label="排名" width="80" align="center" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="score" label="分数" width="120" />
       <el-table-column prop="isFinish" label="是否完成" width="150" />
      <el-table-column prop="orignazion" label="组织" />
      <!-- <el-table-column prop="className" label="班级" width="150" /> -->
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
  type: 'duration' | 'frequency'
  data: {
    rank: number
    name: string
    studentId: string
    score: number
    duration?: number
    frequency?: number
    isFinish:string
    orignazion: string
    className: string
  }[]
}>()

const searchKeyword = ref('')
const isLoading = ref(false)

// 获取所有组织列表（去重）
/* const allOrganizations = computed(() => {
  const orgs = new Set<string>()
  props.data.forEach(item => {
    orgs.add(item.orignazion)
  })
  return Array.from(orgs).sort()
}) */

// 筛选后的数据
const filteredData = computed(() => {
  if (!searchKeyword.value.trim()) {
    return props.data
  }

  const keyword = searchKeyword.value.toLowerCase()
  return props.data.filter(item =>
    item.orignazion.toLowerCase().includes(keyword)
  )
})

// 清空搜索
const handleClearSearch = () => {
  searchKeyword.value = ''
}
</script>

<style scoped>
.usage-ranking-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.el-input {
  width: 300px;
}

.el-table {
  margin-top: 20px;
}
</style>
