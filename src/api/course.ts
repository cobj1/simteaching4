import { PagingProcessor } from "@/utils/paging-processor";
import axios from "../axios";

export interface Course {
  id: string;
  name: string;
}

export const CourseApi = {
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/course/page",
      method: "get",
      params,
    });
  },
  save(data: object) {
    return axios({
      url: "/course/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/course/del/" + id,
      method: "post",
    });
  },
  recode(id: string) {
    return axios({
      url: "/course/recode/" + id,
      method: "post",
    });
  },
  stopcode(id: string) {
    return axios({
      url: "/course/stopcode/" + id,
      method: "post",
    });
  },
  list() {
    return axios({
      url: "/course/list",
      method: "get",
    });
  },
};
