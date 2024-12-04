import axios from "@/axios";

export interface CourseUser {
  id: any;
  cid: string;
  uid: string;
}

export const CourseUserApi = {
  save(data: any, cid: string) {
    return axios({
      url: "/course-user/save?cid=" + cid,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  },
  del(cid: string, uid: string) {
    return axios({
      url: "/course-user/del",
      method: "post",
      params: { cid, uid },
    });
  },
  list(cid: string) {
    return axios({
      url: "/course-user/list/" + cid,
      method: "get",
    });
  },
};
