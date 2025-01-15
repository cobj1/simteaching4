import { defineStore } from "pinia";
import { ref } from "vue";

export const useTestpaperStore = defineStore("testpaper", () => {
  const difficultys = ref(["简单", "普通", "困难"]);
  const models = ref(["固定", "随机"]);
  const features = [
    {
      icon: "mdi-widgets-outline",
      title: "题库的质量",
      subtitle:
        "随机组卷的有效性很大程度上取决于题库的质量。题库中的题目应该经过严格的筛选和审核，确保其科学性、准确性和难度适宜性。",
    },
    {
      icon: "mdi-cogs",
      title: "抽题规则的设定",
      subtitle:
        "抽题规则的设定应该根据考试的目的和要求进行，确保抽取的题目能够有效地考察考生的知识和能力。",
    },
  ];
  return {
    difficultys,
    models,
    features,
  };
});
