import axios from "@/axios";
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
  publicInfo(id: string | null) {
    return axios({
      url: "/user/public/info",
      method: "get",
      params: { id },
    });
  },
  info() {
    return axios({
      url: "/user/info",
      method: "get",
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
  trialPage(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
    name: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/user/trial/page",
      method: "get",
      params,
    });
  },
  updateOnTrialTime(uid: string, onTrialTime: string) {
    return axios({
      url: "/user/updateOnTrialTime",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        uid,
        onTrialTime,
      },
    });
  },
  trialToFormal(uid: string, org: string) {
    return axios({
      url: "/user/trialToFormal",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        uid,
        org,
      },
    });
  },
  valid() {
    return axios({
      url: "/user/valid",
      method: "get",
      params: {
        notify: false,
      },
    });
  },
};
