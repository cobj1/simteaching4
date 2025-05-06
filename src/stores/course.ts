import { CourseApi } from "@/api/course/course";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCourseStore = defineStore("course", () => {
  const courses = ref([]);

  const loadCourses = async () => {
    courses.value = (await CourseApi.list()) as any;
  };
  return {
    courses,
    loadCourses,
  };
});
