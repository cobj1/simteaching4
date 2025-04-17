import axios from "@/axios";
import { PagingProcessor } from "@/utils/paging-processor";

export const SignInApi = {
  signIn() {
    return axios({
      url: "/sign-in",
      method: "post",
    });
  },
  log() {
    return axios({
      url: "/sign-in/log",
      method: "get",
    });
  },
  logs(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
    name: string;
    org: string;
    date: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/sign-in/logs",
      method: "get",
      params,
    });
  },
};
