import { UserApi } from "@/api/user/user";
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
    const authoritys = ref<string[]>([]);

    const login = async (account: string, password: string) => {
      const res = (await UserApi.login(account, password)) as any;
      if (res) {
        token.value = res;
        const permissions = (await UserApi.permission()) as any;
        authoritys.value = permissions.map((item: { key: string }) => item.key);
      }
      return res;
    };

    const logout = () => {
      token.value = null;
      authoritys.value = [];
      Object.keys(info).forEach((key) => ((info as any)[key] = null));
      router.replace("/");
    };

    const auth = (key: string) => {
      return authoritys.value.includes(key);
    };

    return {
      token,
      info,
      authoritys,
      login,
      logout,
      auth,
    };
  },
  {
    persist: true,
  }
);
