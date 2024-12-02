import { PagingProcessor } from "@/utils/paging-processor";
import axios from "../axios";

export interface ResourcePaper {
  id: string;
  name: string;
  score: string;
  category: string;
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
  save(data: ResourcePaper) {
    return axios({
      url: "/resource-paper/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data
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
};
