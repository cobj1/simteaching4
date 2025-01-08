import { SiteApi, SiteType } from "@/api/site";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useHomeStore = defineStore("home", () => {
  const TypeItems = ref([]);
  const NavigationItems = ref<{ text: string; path: string }[]>([]);

  const loadNavigationItems = async () => {
    if (TypeItems.value.length == 0) {
      NavigationItems.value.splice(1, 99);
      const res = (await SiteApi.typeSelectAll()) as any;
      TypeItems.value = res;
      NavigationItems.value = [
        {
          text: "首页",
          path: "/home",
        },
        {
          text: "实验中心",
          path: "/home/center",
        },
        ...res.map((item: SiteType) => {
          return {
            text: item.type,
            path: "/home/" + item.path,
          };
        }),
      ];
    }
  };

  return {
    TypeItems,
    NavigationItems,
    loadNavigationItems,
  };
});
