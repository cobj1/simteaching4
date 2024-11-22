import { useFileStore } from "@/stores/file";
import axios from "../axios";
import { notify } from "@kyvg/vue3-notification";

export const FileApi = {
  filePath: import.meta.env.VITE_APP_FILE_RESOURCE + "/",

  upload(file: any, path: string) {
    const fileStore = useFileStore();
    const id = fileStore.create({ type: "upload", name: file.name });
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
      onUploadProgress(event: any) {
        fileStore.update({ id, progress: event.progress * 100, state: 0 });
      },
    })
      .catch((error) => {
        notify({
          title: "上传文件异常",
          text: "请检查网络 " + error,
          type: "info",
          data: {
            icon: "mdi-alert-circle",
          },
        });
        fileStore.update({ id, progress: 100, state: 2 });
      })
      .finally(() => {
        fileStore.update({ id, progress: 100, state: 1 });
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
