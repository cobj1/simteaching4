import axios from "../axios";

export const FileApi = {
  filePath: import.meta.env.VITE_APP_FILE_RESOURCE + "/",

  upload(file: any, path: string) {
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
  },
  download(url: string) {
    return axios({
      method: "get",
      url: import.meta.env.VITE_APP_FILE_SERVER + "/download/" + url,
      responseType: "blob",
      withCredentials: false,
    });
  },
  downloadTxt(url: string) {
    return axios({
      method: "get",
      url: import.meta.env.VITE_APP_FILE_SERVER + "/download/" + url,
      responseType: "text",
      withCredentials: false,
    });
  },
  ppt2image(file: any) {
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
  },
  delete(url: string) {
    return axios({
      method: "post",
      url: import.meta.env.VITE_APP_FILE_SERVER + "/delete/" + url,
      withCredentials: false,
    });
  },
};
