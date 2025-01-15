import { defineStore } from "pinia";
import { ref } from "vue";

export const useTestpaperStore = defineStore("testpaper", () => {
  const difficultys = ref(["简单", "普通", "困难"]);
  const models = ref(["固定", "随机"]);

  return {
    difficultys,
    models,
  };
});
