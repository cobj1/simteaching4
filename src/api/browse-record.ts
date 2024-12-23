import axios from "../axios";

export const BrowseRecordApi = {
  time(data: any) {
    return axios({
      url: "/browse-record/time",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  count(data: any) {
    return axios({
      url: "/browse-record/count",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
