import axios from "../axios";

export const BrowseRecordApi = {
  save(data: any) {
    return axios({
      url: "/resourceBrowseRecord/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
