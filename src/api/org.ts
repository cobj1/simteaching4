import axios from "../axios";

export const OrgApi = {
  dynamicElement(struct: string, parent: string) {
    return axios({
      url: "org/element/dynamicElement",
      params: {
        struct,
        parent,
      },
    });
  },
  save(data: object) {
    return axios({
      url: "org/element/save",
      method: "post",
      data,
    });
  },
  update(data: object) {
    return axios({
      url: "org/element/update",
      method: "post",
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "org/element/del",
      method: "post",
      data: {
        id,
      },
    });
  },
  selectByUser() {
    return axios({
      url: "org/element/selectByUser",
    });
  },
  selectByParent(parent: string) {
    return axios({
      url: "org/element/selectByParent",
      params: {
        parent,
      },
    });
  },
  selectOneById(id: string) {
    return axios({
      url: "org/element/selectOneById",
      params: {
        id,
      },
    });
  },
  updateAdmin(data: object) {
    return axios({
      url: "org/element/updateAdmin",
      method: "post",
      data,
    });
  },
};
