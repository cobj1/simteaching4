import axios from "../axios";

export const SystemApi = {
  basic() {
    return axios({
      url: "/druid-api/basic",
      method: "get",
    });
  },
  datasource() {
    return axios({
      url: "/druid-api/datasource",
      method: "get",
    });
  },
  activeConnectionStackTrace() {
    return axios({
      url: "/druid-api/activeConnectionStackTrace",
    });
  },

  sql() {
    return axios({
      url: "/druid-api/sql",
    });
  },

  wall() {
    return axios({
      url: "/druid-api/wall",
    });
  },

  webapp() {
    return axios({
      url: "/druid-api/webapp",
    });
  },

  weburi() {
    return axios({
      url: "/druid-api/weburi",
    });
  },

  websession() {
    return axios({
      url: "/druid-api/websession",
    });
  },

  spring() {
    return axios({
      url: "/druid-api/spring",
    });
  },

  getPageLoginLog(current: number, size: number) {
    return axios({
      url: "/operationLog/selectPage",
      params: {
        current,
        size,
      },
    });
  },
};
