import { PagingProcessor } from "@/utils/paging-processor";
import axios from "@/axios";
import { FormDataTimeFormat } from "@/utils/form-data-time-format";

export interface Homework {
  id: any;
  name: string;
}

export const HomeworkApi = {
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
    title: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/homework/page",
      method: "get",
      params,
    });
  },
  save(data: object) {
    data = FormDataTimeFormat(data);
    return axios({
      url: "/homework/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  list(cid: string) {
    return axios({
      url: "/homework/list/" + cid,
      method: "get",
    });
  },
  del(id: string) {
    return axios({
      url: "/homework/del/" + id,
      method: "post",
    });
  },
  approve(id: any) {
    return axios({
      url: "/homework/approve/" + id,
      method: "post",
    });
  },
  stopcode(id: any) {
    return axios({
      url: "/homework/stopcode/" + id,
      method: "post",
    });
  },
  info(id: string | string[]) {
    return axios({
      url: "/homework/" + id,
      method: "get",
    });
  },
  curriculaVariable(code: string) {
    return axios({
      url: "/homework/curricula-variable",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { code },
    });
  },
  checkPage(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/homework/check/page",
      method: "get",
      params,
    });
  },
  checked(id: string, checked: number) {
    return axios({
      url: "/homework/checked",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { id, checked },
    });
  },
};
