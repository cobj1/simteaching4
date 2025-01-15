import { PagingProcessor } from "@/utils/paging-processor";
import axios from "@/axios";

export interface ResourcePaper {
  id: string;
  name: string;
  score: string;
  category: string;
}

export interface ResourcePaperRandomSettings {
  type: string;
  value: number;
}

export const ResourceTestpaperApi = {
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
      url: "/resource-paper/page",
      method: "get",
      params,
    });
  },
  save(
    paper: ResourcePaper,
    randomSettings: ResourcePaperRandomSettings[] | undefined
  ) {
    return axios({
      url: "/resource-paper/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        ...paper,
        randomSettingsData: randomSettings
          ? JSON.stringify(
              randomSettings.map((item) => {
                return { type: item.type, value: item.value };
              })
            )
          : null,
      },
    });
  },
  saveQuestions(data: string) {
    return axios({
      url: "/resource-paper/saveQuestions",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/resource-paper/del/" + id,
      method: "post",
    });
  },
  info(id: string) {
    return axios({
      url: "/resource-paper/" + id,
      method: "get",
    });
  },
  exam(id: string) {
    return axios({
      url: "/resource-paper/exam/" + id,
      method: "get",
    });
  },
  questionsByPid(pid: string) {
    return axios({
      url: "/resource-paper/paper-question/" + pid,
      method: "get",
    });
  },
};
