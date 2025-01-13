import axios from "@/axios";

export const ResourceReportTemplateApi = {
  list() {
    return axios({
      url: "/resource-report-template/list",
      method: "get",
    });
  },
  save(data: object) {
    return axios({
      url: "/resource-report-template/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/resource-report-template/del/" + id,
      method: "post",
    });
  },
  info(id: string) {
    return axios({
      url: "/resource-report-template/info/" + id,
      method: "get",
    });
  },
};
