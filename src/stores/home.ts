import { SiteApi, SiteType } from "@/api/site";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useHomeStore = defineStore("home", () => {
  const NavigationItems = ref<{ text: string; path: string }[]>([
    {
      text: "首页",
      path: "/home",
    },
  ]);

  const loadNavigationItems = async () => {
    if (NavigationItems.value.length <= 1) {
      NavigationItems.value.splice(1, 99);
      const res = (await SiteApi.typeSelectAll()) as any;
      NavigationItems.value.push(
        ...res.map((item: SiteType) => {
          return {
            text: item.type,
            path: "/home/" + item.path,
          };
        })
      );
    }
  };

  return {
    NavigationItems,
    loadNavigationItems,
  };
});
