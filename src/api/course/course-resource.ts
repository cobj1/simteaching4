import axios from "@/axios";

export const CourseResourceApi = {
  list(cid: string) {
    return axios({
      url: "/courseResource/list",
      method: "get",
      params: {
        cid,
      },
    });
  },
  save(data: any, replace: any = "", cid: any = "") {
    return axios({
      url: `/courseResource/save?replace=${replace}&cid=${cid}`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/courseResource/del/" + id,
      method: "post",
    });
  },
  delByCourseId(cid: string) {
    return axios({
      url: "/courseResource/delByCourseId/" + cid,
      method: "post",
    });
  },
  updateScore(crid: string, score: number) {
    return axios({
      url: "/courseResource/updateScore",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        crid,
        score,
      },
    });
  },
  info(crid: string) {
    return axios({
      url: "/courseResource/info/" + crid,
      method: "get",
    });
  },
  finish(crid: string, type: string, answer: string) {
    return axios({
      url: "/courseResource/finish",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        crid,
        type,
        answer,
      },
    });
  },
  logInfo(crid: string) {
    return axios({
      url: "/courseResource/log/info/" + crid,
      method: "get",
    });
  },

};
