import { PagingProcessor } from "@/utils/paging-processor";
import axios from "@/axios";
import { FormDataTimeFormat } from "@/utils/form-data-time-format";

export const HomeworkLogApi = {
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
    name: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/homeworkLog/page",
      method: "get",
      params,
    });
  },
  save(data: object) {
    data = FormDataTimeFormat(data);
    return axios({
      url: "/homeworkLog/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/homeworkLog/del/" + id,
      method: "post",
    });
  },
  list(hid: string) {
    return axios({
      url: "/homeworkLog/list/" + hid,
      method: "get",
    });
  },
  logList(cid: string) {
    return axios({
      url: "/homeworkLog/logList/" + cid,
      method: "get",
    });
  },
};
