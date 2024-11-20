import axios from "../axios";

export interface Permission {
  id: string;
  name: string;
  key: string;
}

export const PermissionApi = {
  selectAll() {
    return axios({
      url: "/user/permission/selectAll",
      method: "get",
    });
  },
  listByRole(role: string) {
    return axios({
      url: "/user/permission/listByRole",
      method: "get",
      params: { role },
    });
  },
};
