import axios from "../axios";
import { PagingProcessor } from "@/utils/paging-processor";

export interface SiteType {
  id: string;
  type: string;
  path?: String;
  displays?: number;
}

export interface Site {
  id: string;
  cover: string;
  title: string;
  author: string;
  content: string;
  typeId: string;
}

export interface SiteCarousel {
  id: string;
  title: string;
  url: string;
  order?: number;
}

export const SiteApi = {
  typeSelectAll() {
    return axios({
      url: "/site/public/type/selectAll",
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
  typeOne(params: { id?: string; type?: string; path?: string | string[] }) {
    return axios({
      url: "/site/public/type/one",
      method: "get",
      params,
    });
  },
  page(params: {
    current: number;
    size: number;
    sortKey?: string;
    sortOrder?: string;
    typeId?: string;
    title?: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/site/public/page",
      method: "get",
      params,
    });
  },
  one(params: { id: string }) {
    return axios({
      url: "/site/public/one",
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
  carouselSave(data: SiteCarousel) {
    return axios({
      url: "/site-carousel/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  carouselDel(id: string) {
    return axios({
      url: "/site-carousel/del/" + id,
      method: "post",
    });
  },
  carouselList() {
    return axios({
      url: "/site-carousel/public/list",
      method: "get",
    });
  },
};
