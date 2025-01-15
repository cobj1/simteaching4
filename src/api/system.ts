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
      method: "get",
    });
  },

  sql() {
    return axios({
      url: "/druid/sql",
      method: "get",
    });
  },

  wall() {
    return axios({
      url: "/druid/wall",
      method: "get",
    });
  },

  webapp() {
    return axios({
      url: "/druid/webapp",
      method: "get",
    });
  },

  weburi() {
    return axios({
      url: "/druid/weburi",
      method: "get",
    });
  },

  websession() {
    return axios({
      url: "/druid/websession",
      method: "get",
    });
  },

  spring() {
    return axios({
      url: "/druid/spring",
      method: "get",
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
