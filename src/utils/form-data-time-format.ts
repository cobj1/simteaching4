import { useDateFormat } from "@vueuse/core";

export const FormDataTimeFormat = (data: any) => {
  Object.keys(data).forEach((key) => {
    if (data[key] instanceof Date) {
      data[key] = useDateFormat(data[key], "YYYY-MM-DD").value;
    }
  });
  return data;
};
