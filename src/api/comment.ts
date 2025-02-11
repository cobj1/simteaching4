import axios from "../axios";

export const CommentApi = {
  list(cid: object) {
    return axios({
      url: "/comment/list/" + cid,
      method: "get",
    });
  },
  save(data: { cid: string; comment: string; rate: number }) {
    return axios({
      url: "/comment/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
