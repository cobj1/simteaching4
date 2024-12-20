import axios from "@/axios";
import { PagingProcessor } from "@/utils/paging-processor";

export const AttendanceApi = {
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
    name: string;
    org: string;
    starDste: string;
    endDate: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/loginLog/page",
      method: "get",
      params,
    });
  },
  own(params: { uid: string; current: number; size: number }) {
    params = PagingProcessor(params);
    return axios({
      url: "/loginLog/own",
      method: "get",
      params,
    });
  },
};
