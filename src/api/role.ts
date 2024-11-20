import axios from "../axios";

export interface Role {
  id: string;
  name: string;
}

export const RoleApi = {
  selectAll() {
    return axios({
      url: "/user/role/selectAll",
      method: "get",
    });
  },
  save(data: object) {
    return axios({
      url: "/user/role/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
