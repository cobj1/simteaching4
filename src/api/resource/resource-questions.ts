import { PagingProcessor } from "@/utils/paging-processor";
import axios from "@/axios";

export interface ResourceQuestions {
  id: string;
  name: string;
  type: string;
  category: string;
  answer: any;
  answerAnalysis: string;
  difficulty: string;
  options: any;
  optionsJsonArray: string;
}

export const ResourceQuestionsApi = {
  page(params: {
    current: number;
    size: number;
    sortKey?: string;
    sortOrder?: string;
    category?: string;
    name?: string;
    type?: string;
    difficulty?: string;
  }) {
    params = PagingProcessor(params);
    return axios({
      url: "/testQuestions/page",
      method: "get",
      params,
    });
  },
  listByIds(ids: string) {
    return axios({
      url: "/testQuestions/listByIds",
      method: "get",
      params: {
        ids,
      },
    });
  },
  save(data: ResourceQuestions) {
    return axios({
      url: "/testQuestions/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        ...data,
        optionsJsonArray: JSON.stringify(data.options),
        options: null,
        answer:
          data.answer instanceof Array
            ? data.answer.sort((a, b) => a - b).join(",")
            : data.answer,
      },
    });
  },
  del(id: string) {
    return axios({
      url: "/testQuestions/del/" + id,
      method: "post",
    });
  },
  info(id: string) {
    return axios({
      url: "/testQuestions/info",
      method: "get",
      params: { id },
    });
  },
};
