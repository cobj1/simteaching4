import axios from "@/axios";
import { PagingProcessor } from "@/utils/paging-processor";

export interface ResourceShare {
  id: string;
  rid: string;
  rname: string;
  creator: string;
  creatorName: string;
  type: string;
  category: string;
  cites: number;
  cover: string;
  code: string;
}

export const ResourceShareApi = {
  page(params: {
    current: number;
    size: number;
    sortKey?: string;
    sortOrder?: string;
    category?: string;
    name?: string;
    type?: string;
    self: boolean;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/resource-share/page",
      method: "get",
      params,
    });
  },
  save(data: { rids: string; type: string; category: string }) {
    return axios({
      url: "/resource-share/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/resource-share/del/" + id,
      method: "post",
    });
  },
  recode(id: string) {
    return axios({
      url: "/resource-share/recode/" + id,
      method: "post",
    });
  },
  categoryList() {
    return axios({
      url: "/resource-share/share-type/selectAll",
      method: "get",
    });
  },
  quoteResources(code: string) {
    return axios({
      url: "/resource-share/quoteResources/" + code,
      method: "post",
    });
  },
};
