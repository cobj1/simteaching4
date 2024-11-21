import axios from "../axios";

export interface SiteType {
  id: string;
  type: string;
}

export interface Site {
  id: string;
  cover: string;
  title: string;
  author: string;
  content: string;
  typeId: string;
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
  typeSave(data: SiteType) {
    return axios({
      url: "/site/type/saveAndUpdate",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  page(params: {
    current: number;
    size: number;
    sortKey: string;
    sortOrder: string;
    typeId: string;
    title: string;
  }) {
    return axios({
      url: "/site/page",
      method: "get",
      params,
    });
  },
  del(id: string) {
    return axios({
      url: "/site/del/" + id,
      method: "post",
    });
  },
  save(data: Site) {
    return axios({
      url: "/site/saveAndUpdateSite",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
