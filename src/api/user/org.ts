import axios from "@/axios";

export const OrgApi = {
  selectByAdmin(childrenCount: boolean = false) {
    return axios({
      url: "org/element/selectByAdmin",
      method: "get",
      params: {
        childrenCount,
      },
    });
  },
  selectByParent(parent: string, childrenCount: boolean = false) {
    return axios({
      url: "org/element/selectByParent",
      method: "get",
      params: {
        parent,
        childrenCount,
      },
    });
  },
  selectOneAndParentById(id: string) {
    return axios({
      url: "org/element/selectOneAndParentById",
      method: "get",
      params: {
        id,
      },
    });
  },
  del(id: string) {
    return axios({
      url: "org/element/del",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        id,
      },
    });
  },
  save(data: { id: string; parentId: string; name: string }) {
    return axios({
      url: "org/element/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  fetchExperimentStats(orgid: string) {
    return axios({
      url: "statistics/score_dis",
      method: "get",
      params: {
        orgid,
       
      },
    });
  }
};
