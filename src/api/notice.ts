import axios from "../axios";

export const NoticeApi = {
  noticeType: ["通知", "公告"],
  page(current: number, size: number, sortKey: string, sortOrder: string) {
    return axios({
      url: "/notice/page",
      method: "get",
      params: {
        current,
        size,
        sortKey,
        sortOrder,
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
  updateState(state: string, id: string) {
    return axios({
      url: "/notice/updateState",
      method: "post",
      data: {
        state,
        id,
      },
    });
  },
  saveNoticeBrowseLog(noticeId: string) {
    return axios({
      url: "/notice/saveNoticeBrowseLog",
      method: "post",
      data: {
        noticeId,
      },
    });
  },
  getNoticeBrowseLog(noticeId: string) {
    return axios({
      url: "/notice/getNoticeBrowseLog",
      params: {
        noticeId,
      },
    });
  },
  getNoticeBrowseLogCount(noticeId: string) {
    return axios({
      url: "/notice/getNoticeBrowseLogCount",
      params: {
        noticeId,
      },
    });
  },
  selectAll(type: any) {
    if (type == "全部资讯") {
      type = null;
    }
    return axios({
      url: "/notice/selectAll",
      params: {
        type,
      },
    });
  },
  selectOwnAll() {
    return axios({
      url: "/notice/selectOwnAll",
    });
  },

  selectOwnNoticePage(current: number, size: number) {
    return axios({
      url: "/notice/selectOwnNoticePage",
      params: {
        current,
        size,
      },
    });
  },
  info(id: number) {
    return axios({
      url: "/notice/info",
      params: {
        id,
      },
    });
  },
};
