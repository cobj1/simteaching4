import { PagingProcessor } from "@/utils/paging-processor";
import axios from "@/axios";
import { FormDataTimeFormat } from "@/utils/form-data-time-format";

export interface Course {
  id: any;
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
    data = FormDataTimeFormat(data);
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
  recode(id: any) {
    return axios({
      url: "/course/recode/" + id,
      method: "post",
    });
  },
  stopcode(id: any) {
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
  info(id: string | string[]) {
    return axios({
      url: "/course/" + id,
      method: "get",
    });
  },
  curriculaVariable(code: string) {
    return axios({
      url: "/course/curricula-variable",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { code },
    });
  },
  getRegisterCourse() {
    return axios({
      url: "/course/getRegisterCourse",
      method: "get",
    });
  },
  transcript(id: string) {
    return axios({
      url: "/course/transcript/" + id,
      method: "get",
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
      url: "/course/check/page",
      method: "get",
      params,
    });
  },
  checked(id: string, checked: number) {
    return axios({
      url: "/course/checked",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { id, checked },
    });
  },
};
