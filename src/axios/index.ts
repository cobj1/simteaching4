import { useAccountStore } from "@/stores/account";
import { notify } from "@kyvg/vue3-notification";
import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_SERVER,
  withCredentials: false,
  timeout: 0,
});

service.interceptors.request.use(
  (config) => {
    const accountStore = useAccountStore();
    config.headers["x-token"] = accountStore.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.status == 401) {
      notify.close(401);
      notify({
        id: 401,
        title: "401 Unauthorized",
        text: "未经授权请重新登录后尝试",
        type: "info",
        data: {
          icon: "mdi-alert-circle",
        },
      });
      const accountStore = useAccountStore();
      accountStore.logout();
    }
    if (error.status == 400) {
      notify.close(400);
      notify({
        id: 401,
        title: "400 Bad Request",
        text: error.response.data,
        type: "info",
        data: {
          icon: "mdi-alert-circle",
        },
      });
    }
    return Promise.reject(error);
  }
);

export default service;
