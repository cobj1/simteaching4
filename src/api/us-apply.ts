import axios from "../axios";

export function giveATrial(data: object) {
  return axios({
    url: "/apply/giveATrial",
    method: "post",
    data,
  });
}

export function examine(
  id: string,
  deadline: string,
  describe: string,
  state: string
) {
  return axios({
    url: "/apply/examine",
    method: "post",
    data: {
      id,
      deadline,
      describe,
      state,
    },
  });
}

export function selectTrialPage(current: number, size: number) {
  return axios({
    url: "/apply/selectTrialPage",
    method: "get",
    params: {
      current,
      size,
    },
  });
}
