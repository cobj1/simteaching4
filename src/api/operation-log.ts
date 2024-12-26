import { PagingProcessor } from "@/utils/paging-processor";
import axios from "../axios";

export const OperationLogApi = {
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/operationLog/page",
      method: "get",
      params,
    });
  },
};
