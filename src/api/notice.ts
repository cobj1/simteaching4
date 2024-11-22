import { PagingProcessor } from "@/utils/paging-processor";
import axios from "../axios";

export const NoticeApi = {
  noticeType: ["通知", "公告"],
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/notice/page",
      method: "get",
      params,
    });
  },
  save(data: object) {
    return axios({
      url: "/notice/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/notice/del/" + id,
      method: "post",
    });
  },
};
