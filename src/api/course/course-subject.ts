import axios from "@/axios";

export interface CourseSubject {
  id: any;
  cid: string;
  name: string;
  explain: string;
  order: number;
}

export const CourseSubjectApi = {
  save(data: CourseSubject) {
    return axios({
      url: "/course-subject/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: any) {
    return axios({
      url: "/course-subject/del/" + id,
      method: "post",
    });
  },
  list(cid: string) {
    return axios({
      url: "/course-subject/list/" + cid,
      method: "get",
    });
  },
};
