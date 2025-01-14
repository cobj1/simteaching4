import { defineStore } from "pinia";
import { ref } from "vue";

export const useQuestionsStore = defineStore("questions", () => {
  const types = ref(["单选题", "多选题", "简答题", "仿真题"]);
  const difficultys = ref(["简单", "普通", "困难"]);

  return {
    types,
    difficultys,
  };
});
