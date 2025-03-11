import axios from "../axios";

export const StatisticsApi = {
  visitStat() {
    return axios({
      url: "/statistics/visitStat",
      method: "get",
    });
  },
  dailyLoginStat(startDate: string, endDate: string) {
    return axios({
      url: "/statistics/dailyLoginStat",
      method: "get",
      params: {
        startDate,
        endDate,
      },
    });
  },
};
