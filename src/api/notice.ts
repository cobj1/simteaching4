import axios from "../axios";
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

export const NoticeApi = {
  noticeType: ["通知", "公告"],
  page(current: number, size: number, sortKey: string, sortOrder: string) {
    const _sortKey = sortKey ? useChangeCase(sortKey, "snakeCase").value : null;
    const _sortOrder = sortOrder ? useChangeCase(sortOrder, "snakeCase").value : null;
    return axios({
      url: "/notice/page",
      method: "get",
      params: {
        current,
        size,
        sortKey: _sortKey,
        sortOrder: _sortOrder,
      },
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
