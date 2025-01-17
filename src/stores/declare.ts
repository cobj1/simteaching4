import { defineStore } from "pinia";

export const useDeclareStore = defineStore("declare", () => {
  const categorys = [
    "工学",
    "理学",
    "医学",
    "管理学",
    "经济学",
    "法学",
    "哲学",
    "农学",
    "教育学",
    "历史学",
    "艺术学",
    "文学",
  ];

  const types = ["基础练习型", "综合设计型", "研究探索型"];

  return {
    categorys,
    types
  };
});
