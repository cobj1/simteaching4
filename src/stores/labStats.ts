// src/types/api.d.ts

// 学院接口
interface College {
  id: string;
  name: string;
  code?: string;
}

// 课程接口
interface Course {
  id: string;
  name: string;
  code?: string;
}

// 实验统计接口
interface ExperimentStat {
  id: string;
  name: string;
  below60: number;
  sixtyTo79: number;
  above80: number;
  average: number;
  completionRate: number;
  department?: string;
}

// API响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export type { College, Course, ExperimentStat, ApiResponse };
