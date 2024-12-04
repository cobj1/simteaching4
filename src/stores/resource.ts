import { ResourceApi } from "@/api/resource/resource";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useResourceStore = defineStore("resource", () => {
  const categorys = ref([]);

  const loadCategorys = async () => {
    categorys.value = (await ResourceApi.categorySelectAll()) as any;
  };
  return {
    categorys,
    loadCategorys,
  };
});
