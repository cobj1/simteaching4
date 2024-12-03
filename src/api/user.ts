import axios from "../axios";
import { PagingProcessor } from "@/utils/paging-processor";

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
      url: "/user/public/info",
      method: "get",
      params: { id },
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
  repwd(id: string, newpwd: string) {
    return axios({
      url: "/user/repwd",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        id,
        newpwd,
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
    params = PagingProcessor(params);
    return axios({
      url: "/user/page",
      method: "get",
      params,
    });
  },
  trialPage() {
    return axios({
      url: "/user/trial/page",
      method: "get",
    });
  },
};
