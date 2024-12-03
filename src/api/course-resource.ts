import axios from "../axios";

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
  save(data: any) {
    return axios({
      url: "/courseResource/save",
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

};
