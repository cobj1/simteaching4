import axios from "../axios";

export const CreditsApi = {
  credits() {
    return axios({
      url: "/credits",
      method: "get",
    });
  },
};
