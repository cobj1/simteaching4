import { OrgApi } from "@/api/org";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrgStore = defineStore("org", () => {
  const _items = ref([]);

  const items = async (childrenCount: boolean = false) => {
    if (_items.value.length == 0) {
      _items.value = (await OrgApi.selectByAdmin(childrenCount)) as any;
    }
    return _items.value;
  };
  return {
    items,
  };
});
