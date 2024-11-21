import axios from "../axios";

export interface Site {
  id: string;
  type: string;
}

export const SiteApi = {
  typeSelectAll() {
    return axios({
      url: "/site/type/selectAll",
      method: "get",
    });
  },
  typeDel(id: string) {
    return axios({
      url: "/site/type/del/" + id,
      method: "post",
    });
  },
  typeSave(data: Site) {
    return axios({
      url: "/site/type/saveAndUpdate",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
