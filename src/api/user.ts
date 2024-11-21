import { useChangeCase } from "@vueuse/integrations/useChangeCase";
import axios from "../axios";

export const UserApi = {
  login(account: string, password: string) {
    return axios({
      url: "/user/login",
      method: "get",
      params: {
        account,
        password,
      },
    });
  },
  info(id: string) {
    return axios({
      url: "/user/info",
      method: "get",
      params: {
        id,
      },
    });
  },
  permission() {
    return axios({
      url: "/user/permission",
      method: "get",
    });
  },
  save(data: object) {
    return axios({
      url: "/user/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/user/del",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        id,
      },
    });
  },
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
    name: string;
    role: string;
    org: string;
  }) {
    const _sortKey = params.sortKey
      ? useChangeCase(params.sortKey, "snakeCase").value
      : null;
    const _sortOrder = params.sortOrder
      ? useChangeCase(params.sortOrder, "snakeCase").value
      : null;
    return axios({
      url: "/user/page",
      method: "get",
      params: {
        ...params,
        sortKey: _sortKey,
        sortOrder: _sortOrder,
      },
    });
  },
};
