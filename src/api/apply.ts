import axios from "../axios";

export const ApplayApi = {
  giveATrial(data: object) {
    return axios({
      url: "/apply/giveATrial",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  examine(id: string, deadline: string, describe: string, state: string) {
    return axios({
      url: "/apply/examine",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        id,
        deadline,
        describe,
        state,
      },
    });
  },
  page(state: string) {
    return axios({
      url: "/apply/page",
      method: "get",
      params: {
        current: 1,
        size: 100,
        state,
      },
    });
  },
};
