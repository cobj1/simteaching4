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
  updateCourseResourceScore(crid: string, score: number) {
    return axios({
      url: "/courseResource/updateCourseResourceScore",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        crid,
        score,
      },
    });
  },
};
