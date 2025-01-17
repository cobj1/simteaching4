import axios from "../axios";

export const CommentApi = {
  list(cid: object) {
    return axios({
      url: "/comment/list/" + cid,
      method: "get",
    });
  },
};
