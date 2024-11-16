import axios from "../axios";

export function login(account: string, password: string) {
  return axios({
    url: "/user/login",
    method: "get",
    params: {
      account,
      password,
    },
  });
}

export function info(id: string) {
  return axios({
    url: "/user/info",
    params: {
      id,
    },
  });
}

export function permission() {
  return axios({
    url: "/user/permission",
  });
}

export function save(data: object) {
  return axios({
    url: "/user/save",
    method: "post",
    data,
  });
}

export function update(data: object) {
  return axios({
    url: "/user/update",
    method: "post",
    data,
  });
}

export function del(id: string) {
  return axios({
    url: "/user/del",
    method: "post",
    data: {
      id,
    },
  });
}

export function selectByElementProgeny(params: object) {
  return axios({
    url: "/user/selectByElementProgeny",
    params,
  });
}

export function dynamic() {
  return axios({
    url: "/user/dynamic",
  });
}

export function modifyPersonalInfo(data: object) {
  return axios({
    url: "/user/modifyPersonalInfo",
    method: "post",
    data,
  });
}

export function changePwd(newPwd: string, oldPwd: string) {
  return axios({
    url: "/user/changePwd",
    method: "post",
    data: {
      newPwd,
      oldPwd,
    },
  });
}

export function updateAvatar(avatar: string) {
  return axios({
    url: "/user/updateAvatar",
    method: "post",
    data: {
      avatar,
    },
  });
}

export function updateUserName(userName: string) {
  return axios({
    url: "/user/updateUserName",
    method: "post",
    data: {
      userName,
    },
  });
}

export function getOrgAdmins(orgId: string) {
  return axios({
    url: "/user/getOrgAdmins",
    params: {
      orgId,
    },
  });
}

export function selectPageTrialUser(
  current: string,
  size: string,
  account: string,
  name: string,
  org: string
) {
  return axios({
    url: "/user/selectPageTrialUser",
    params: {
      current,
      size,
      account,
      name,
      org,
    },
  });
}

export function updateOnTrial(onTrial: string, userId: string) {
  return axios({
    url: "/user/updateOnTrial",
    method: "post",
    data: {
      onTrial,
      userId,
    },
  });
}

export function updateOnTrialTime(onTrialTime: string, userId: string) {
  return axios({
    url: "/user/updateOnTrialTime",
    method: "post",
    data: {
      onTrialTime,
      userId,
    },
  });
}
