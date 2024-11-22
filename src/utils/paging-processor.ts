import { useChangeCase } from "@vueuse/integrations/useChangeCase";

export const PagingProcessor = (data: any) => {
  const _sortKey = data.sortKey
    ? useChangeCase(data.sortKey, "snakeCase").value
    : null;
  const _sortOrder = data.sortOrder
    ? useChangeCase(data.sortOrder, "snakeCase").value
    : null;
  return {
    ...data,
    sortKey: _sortKey,
    sortOrder: _sortOrder,
  };
};
