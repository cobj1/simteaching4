import { RoleApi } from "@/api/user/role";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoleStore = defineStore("role", () => {
  const _items = ref([]);

  const items = async () => {
    if (_items.value.length == 0) {
      _items.value = (await RoleApi.listByUserPermission()) as any;
    }
    return _items.value;
  };
  return {
    items,
  };
});
