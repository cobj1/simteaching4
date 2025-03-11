import { FileApi } from "@/api/file";

export const useFileUri = (url: string) => {
  return url?.includes("http") ? url : FileApi.filePath + url;
};
