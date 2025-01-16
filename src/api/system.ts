import axios from "../axios";

export const SystemApi = {
  basic() {
    return axios({
      url: "/data/basic",
      method: "get",
    });
  },
  datasource() {
    return axios({
      url: "/data/datasource",
      method: "get",
    });
  },
  activeConnectionStackTrace() {
    return axios({
      url: "/data/activeConnectionStackTrace",
      method: "get",
    });
  },

  sql() {
    return axios({
      url: "/data/sql",
      method: "get",
    });
  },

  wall() {
    return axios({
      url: "/data/wall",
      method: "get",
    });
  },

  webapp() {
    return axios({
      url: "/data/webapp",
      method: "get",
    });
  },

  weburi() {
    return axios({
      url: "/data/weburi",
      method: "get",
    });
  },

  websession() {
    return axios({
      url: "/data/websession",
      method: "get",
    });
  },

  spring() {
    return axios({
      url: "/data/spring",
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
