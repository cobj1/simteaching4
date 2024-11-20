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
  selectTrialPage(state: string) {
    return axios({
      url: "/apply/selectTrialPage",
      method: "get",
      params: {
        state,
      },
    });
  },
};
