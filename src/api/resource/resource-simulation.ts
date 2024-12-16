import { PagingProcessor } from "@/utils/paging-processor";
import axios from "@/axios";

export interface ResourceSimulation {
  id: string;
  name: string;
  type: string;
  category: string;
  introduce: string;
  url: string;
  size: string;
  appid: string;
  cover: string;
}

export const ResourceSimulationApi = {
  page(params: {
    current: number;
    size: number;
    sortKey?: string;
    sortOrder?: string;
    category?: string;
    name?: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/simulationResources/page",
      method: "get",
      params,
    });
  },
  save(data: ResourceSimulation) {
    return axios({
      url: "/simulationResources/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/simulationResources/del/" + id,
      method: "post",
    });
  },
  info(id: string) {
    return axios({
      url: "/simulationResources/info/" + id,
      method: "get",
    });
  },
};
