import axios from "@/axios";
import { PagingProcessor } from "@/utils/paging-processor";
import { ResourceSimulationApi } from "./resource-simulation";
import { ResourceQuestionsApi } from "./resource-questions";
import { ResourceTestpaperApi } from "./resource-paper";

export interface ResourceCategory {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  url: string;
  extensions: string;
  duration: number;
  size: string;
}

export const ResourceApi = {
  categorySelectAll() {
    return axios({
      url: "/resource/directory/selectAll",
      method: "get",
    });
  },
  categoryDel(id: string) {
    return axios({
      url: "/resource/directory/del/" + id,
      method: "post",
    });
  },
  categorySave(data: ResourceCategory) {
    return axios({
      url: "/resource/directory/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
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
      url: "/resource/page",
      method: "get",
      params,
    });
  },
  save(data: Resource) {
    return axios({
      url: "/resource/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/resource/del/" + id,
      method: "post",
    });
  },
  info(id: string, type: string | null) {
    if (type == "simulation") {
      return ResourceSimulationApi.info(id);
    } else if (type == "questions") {
      return ResourceQuestionsApi.info(id);
    } else if (type == "testpaper") {
      return ResourceTestpaperApi.info(id);
    }
    return axios({
      url: "/resource/info/" + id,
      method: "get",
    });
  },
};
