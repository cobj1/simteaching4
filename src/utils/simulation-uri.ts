import { FileApi } from "@/api/file";

export const SimulationUri = (url: string) => {
  return url.includes('http') ? url : FileApi.filePath + url;
};
