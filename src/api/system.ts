import axios from "../axios";

export const SystemApi = {
  basic() {
    return axios({
      url: "/druid/basic",
      method: "get",
    });
  },
  datasource() {
    return axios({
      url: "/druid/datasource",
      method: "get",
    });
  },
  activeConnectionStackTrace() {
    return axios({
      url: "/druid/activeConnectionStackTrace",
    });
  },

  sql() {
    return axios({
      url: "/druid/sql",
    });
  },

  wall() {
    return axios({
      url: "/druid/wall",
    });
  },

  webapp() {
    return axios({
      url: "/druid/webapp",
    });
  },

  weburi() {
    return axios({
      url: "/druid/weburi",
    });
  },

  websession() {
    return axios({
      url: "/druid/websession",
    });
  },

  spring() {
    return axios({
      url: "/druid/spring",
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
