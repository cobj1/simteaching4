import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { login as loginApi } from "../api/us-user";

export const useAccountStore = defineStore("account", () => {
  const info = reactive({
    id: null,
    name: null,
  });

  const roles = ref([]);
  const authoritys = ref([]);

  const login = async (account: string, password: string) => {
    const res = await loginApi(account, password);
    console.log(res);
  };

  return {
    info,
    roles,
    authoritys,
    login,
  };
});
