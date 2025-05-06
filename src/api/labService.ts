

import axios from "@/axios";
import { OrgApi } from "./user/org";

export interface Organization {
  id: string;
  parentId: string | null;
  name: string;
  maxUser: number;
  creator: string;

}
export interface Lab {
  id: string;
  name: string;
 

}

export interface ExperimentStat {
  id: string;
  name: string;
  below60: number;
  sixtyTo79: number;
  above80: number;
  average: number;
  completionRate: number;
  completed_stu:number;
  total_stu:number;
  orgId: string;
}
//做实验学生信息
export interface ExperimentStat_Stu {
  org_names:string;
 
  score:string;
 
  user_id:string;
 
  user_name:string;
  totalTime:string;
  totalCount:string;
 
}

//字段要与后台一致
export const labApi={
  //获取仿真实验信息
  selectExperimentStats(orgid: string) {
    return axios({
      url: "statistics/score_dis",
      method: "get",
      params: {
        orgid,
       
      },
    });
  },
 //获取仿真实验
  selectLab(orgid: string) {
    return axios({
      url: "statistics/sim_list_by_org",
      method: "get",
      params: {
        orgid,
       
      },
    });
  },

  //获取仿真实验
  selectLab_StuInfo(orgid: string,simid:string) {
    return axios({
      url: "statistics/score_list",
      method: "get",
      params: {
        orgid,
        simid,
      },
    });
  },
}

class ApiService {
  // 获取所有学院
  async fetchColleges(): Promise<Organization[]> {
    try {
      const response = await OrgApi.selectByAdmin(true);
      // 从 Axios 响应中提取 data 字段
      //  console.log('获取组织数据:', response);
      const data = response.data ?? response;
      if (!Array.isArray(data)) {
        throw new Error(`API返回的数据不是数组: ${JSON.stringify(data)}`);
      }

      // 5. 返回验证后的数据
      return data;

    } catch (error) {
      console.error('获取组织数据失败:', error);
      throw error;
    }
  }
 //获取虚仿实验列表
  async fetchLabs(orgid: string): Promise<Lab[]> {
    try {
      const response = await labApi.selectLab(orgid);
      // 从 Axios 响应中提取 data 字段
      // console.log('获取组织数据:', response);
      const data = response.data ?? response;
      // console.log("实验列表数据",response);
  
         // 数据转换
    const transformedData: Lab[] = data.map((item: {sim_id:any; sim_name:any })=> ({
      id: item.sim_id , // 如果没有ID可以生成一个
      name: item.sim_name,
     
    }));
    // console.log("返回虚拟实验数据",transformedData.length);
      // 5. 返回验证后的数据
      return transformedData;

    } catch (error) {
      console.error('获取实验数据失败:', error);
      throw error;
    }
  }
  //获取虚仿总信息
  async fetchExperimentStats(orgid: string): Promise<ExperimentStat[]> {
    try {
      const response = await labApi.selectExperimentStats(orgid);
      // 从 Axios 响应中提取 data 字段
      // console.log('获取组织数据:', response);
      const data = response.data ?? response;


        // console.log("实验数据",response);
  
         // 数据转换
    const transformedData: ExperimentStat[] = data.map((item: {
      total_stu: any;
      completed_stu: any;
      sim_id:any;
       sim_name: any; 
       under60: any; 
       between60_79: any; 
       above80: any; 
       avg_score: any; 
       rate: string; 
       department: any; 
})=> ({
      id: item.sim_id , // 如果没有ID可以生成一个
      name: item.sim_name,
      below60: item.under60,
      sixtyTo79: item.between60_79,
      above80: item.above80,
      average: item.avg_score,
      completed_stu:item.completed_stu,
      total_stu:item.total_stu,
      completionRate: item.rate,//parseFloat(item.rate.replace('%', '')), // 去掉百分号
      orgid: item.department // 如果有的话
    }));
    // console.log("返回验证后的数据",transformedData);
      // 5. 返回验证后的数据
      return transformedData;

    } catch (error) {
      console.error('获取实验数据失败:', error);
      throw error;
    }
  }

//获取做过虚仿的学生信息
  async fetchExperimentStats_Stu(orgid: string,labId:string): Promise<ExperimentStat_Stu[]> {
    try {
      const response = await labApi.selectLab_StuInfo(orgid,labId);
      // 从 Axios 响应中提取 data 字段
      // console.log('获取组织数据:', response);
      const data = response.data ?? response;


      console.log("数据",response);
  
         // 数据转换
    const transformedData: ExperimentStat_Stu[] = data.map((item: {
      org_names:string;
 
      score:string;
     
      user_id:string;
     
      user_name:string;
      total_time:string;
      browse_count:string;
})=> ({
  org_names: item.org_names , // 如果没有ID可以生成一个
  score: item.score,
  user_id: item.user_id,
  user_name: item.user_name,
   totalTime:item.total_time,
      totalCount:item.browse_count,
   
    }));
    // console.log("返回验证后的数据",transformedData);
      // 5. 返回验证后的数据
      return transformedData;

    } catch (error) {
      console.error('获取实验数据失败:', error);
      throw error;
    }
  }
}

export const apiLabService = new ApiService();
