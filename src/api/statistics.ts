import axios from "../axios";

export const StatisticsApi = {
  visitStat() {
    return axios({
      url: "/statistics/visitStat",
      method: "get",
    });
  },
  dailyLoginStat() {
    return axios({
      url: "/statistics/dailyLoginStat",
      method: "get",
    });
  },
};
