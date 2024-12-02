import { UserApi } from "@/api/user";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

export const useAccountStore = defineStore(
  "account",
  () => {
    const router = useRouter();
    const token = ref();
    const info = reactive({
      id: null,
      name: null,
    });
    const roles = ref([]);
    const authoritys = ref([]);

    const login = async (account: string, password: string) => {
      const res = (await UserApi.login(account, password)) as any;
      if (res) token.value = res;
      return res;
    };

    const logout = () => {
      token.value = null;
      roles.value = [];
      authoritys.value = [];
      Object.keys(info).forEach((key) => ((info as any)[key] = null));
      router.replace("/");
    };

    return {
      token,
      info,
      roles,
      authoritys,
      login,
      logout,
    };
  },
  {
    persist: true,
  }
);
