import axios from "../axios";

export const filePath = import.meta.env.VITE_APP_FILE_RESOURCE + "/";

export function upload(file: any, path: string) {
  return axios({
    method: "post",
    url: import.meta.env.VITE_APP_FILE_SERVER + "/upload",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: false,
    data: {
      file,
      path,
    },
  });
}

export function download(url: string) {
  return axios({
    method: "get",
    url: import.meta.env.VITE_APP_FILE_SERVER + "/download/" + url,
    responseType: "blob",
    withCredentials: false,
  });
}

export function ppt2image(file: any) {
  return axios({
    method: "post",
    url: import.meta.env.VITE_APP_FILE_SERVER + "/ppt/ppt2image",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: false,
    data: {
      file,
    },
  });
}
