import axios from "../axios";

export const UserApi = {
  login(account: string, password: string) {
    return axios({
      url: "/user/login",
      method: "get",
      params: {
        account,
        password,
      },
    });
  },
  info(id: string) {
    return axios({
      url: "/user/info",
      params: {
        id,
      },
    });
  },
  permission() {
    return axios({
      url: "/user/permission",
    });
  },
  save(data: object) {
    return axios({
      url: "/user/save",
      method: "post",
      data,
    });
  },
  update(data: object) {
    return axios({
      url: "/user/update",
      method: "post",
      data,
    });
  },
  del(id: string) {
    return axios({
      url: "/user/del",
      method: "post",
      data: {
        id,
      },
    });
  },
  selectByElementProgeny(params: object) {
    return axios({
      url: "/user/selectByElementProgeny",
      params,
    });
  },
  dynamic() {
    return axios({
      url: "/user/dynamic",
    });
  },
  modifyPersonalInfo(data: object) {
    return axios({
      url: "/user/modifyPersonalInfo",
      method: "post",
      data,
    });
  },
  changePwd(newPwd: string, oldPwd: string) {
    return axios({
      url: "/user/changePwd",
      method: "post",
      data: {
        newPwd,
        oldPwd,
      },
    });
  },
  updateAvatar(avatar: string) {
    return axios({
      url: "/user/updateAvatar",
      method: "post",
      data: {
        avatar,
      },
    });
  },
  updateUserName(userName: string) {
    return axios({
      url: "/user/updateUserName",
      method: "post",
      data: {
        userName,
      },
    });
  },
  getOrgAdmins(orgId: string) {
    return axios({
      url: "/user/getOrgAdmins",
      params: {
        orgId,
      },
    });
  },
  selectPageTrialUser() {
    return axios({
      url: "/user/selectPageTrialUser",
      method: "get",
    });
  },
  updateOnTrial(onTrial: string, userId: string) {
    return axios({
      url: "/user/updateOnTrial",
      method: "post",
      data: {
        onTrial,
        userId,
      },
    });
  },
  updateOnTrialTime(onTrialTime: string, userId: string) {
    return axios({
      url: "/user/updateOnTrialTime",
      method: "post",
      data: {
        onTrialTime,
        userId,
      },
    });
  },
};
