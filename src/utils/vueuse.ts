import * as core from "@vueuse/core";

export const useTimeAgo = (date: Date | number | string) => {
  const str = core.useTimeAgo(date);
  switch (str.value) {
    case "just now":
      return "刚才";
  }
  return str;
};
