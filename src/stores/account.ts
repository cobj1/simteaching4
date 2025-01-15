import { CreditsApi } from "@/api/credits";
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
      account: null,
      name: null,
      avatar: null,
      phone: null,
      email: null,
      post: null,
    });
    const authoritys = ref<string[]>([]);
    const credits = ref(0);

    const login = async (
      account: string,
      password: string,
      guest: boolean = false
    ) => {
      const res = (
        guest ? await UserApi.guest() : await UserApi.login(account, password)
      ) as any;

      if (res) {
        token.value = res;

        const permissions = (await UserApi.permission()) as any;
        authoritys.value = permissions.map((item: { key: string }) => item.key);

        const user = (await UserApi.info()) as any;
        info.account = user.account;
        info.name = user.name;
        info.avatar = user.avatar;
        info.phone = user.phone;
        info.email = user.email;
        info.post = user.post;
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

    const validateValid = async () => UserApi.valid();

    const loadCredits = async () =>
      (credits.value = (await CreditsApi.credits()) as any);

    return {
      token,
      info,
      authoritys,
      credits,
      login,
      logout,
      auth,
      validateValid,
      loadCredits,
    };
  },
  {
    persist: true,
  }
);
