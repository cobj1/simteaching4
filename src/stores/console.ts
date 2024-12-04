import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { CourseApi } from "@/api/course/course";
import { useRoleStore } from "@/stores/role";

export const useConsoleStore = defineStore("console", () => {
  const accountStore = useAccountStore();
  const roleStore = useRoleStore();

  const userManage = ref<{ title: string; path: string }[]>([]);
  const courseManage = ref<
    {
      prependIcon?: string;
      type?: string;
      title: string;
      link?: boolean;
      path?: string;
      show?: boolean;
    }[]
  >([]);
  const courseRegister = ref<
    {
      prependIcon?: string;
      type?: string;
      avatar?: string;
      subtitle?: string;
      path?: string;
      title: string;
      show?: boolean;
    }[]
  >([]);
  const defaultManage = ref([
    {
      title: "后台首页",
      prependIcon: "mdi-home-outline",
      link: true,
      path: "/console",
    },
    {
      show: accountStore.auth("course"),
      title: "课程管理",
      prependIcon: "mdi-school-outline",
      link: true,
      path: "/console/course",
    },
    {
      show: accountStore.auth("resource"),
      title: "资源库",
      prependIcon: "mdi-library-outline",
      link: true,
      children: [
        {
          title: "资料",
          path: "/console/resource/courseware",
        },
        {
          title: "仿真",
          path: "/console/resource/simulation",
        },
        {
          title: "题库",
          path: "/console/resource/questions",
        },
        {
          title: "测试",
          path: "/console/resource/testpaper",
        },
      ],
    },
    {
      show: accountStore.auth("share"),
      title: "共享资源库",
      prependIcon: "mdi-share-variant-outline",
      link: true,
      path: "/console/resource/share",
    },
    {
      show: accountStore.auth("attendance"),
      title: "考勤管理",
      prependIcon: "mdi-calendar-check-outline",
      link: true,
      path: "/console/attendance",
    },
    {
      show: accountStore.auth("notice"),
      title: "通知公告",
      prependIcon: "mdi-bell-cog-outline",
      link: true,
      path: "/console/notice",
    },
    {
      show: accountStore.auth("site"),
      title: "门户管理",
      prependIcon: "mdi-web",
      link: true,
      path: "/console/site",
    },
    {
      show: accountStore.auth("org"),
      title: "组织管理",
      prependIcon: "mdi-bank",
      link: true,
      path: "/console/org",
    },
    {
      show: accountStore.auth("user"),
      title: "用户管理",
      prependIcon: "mdi-account-cog-outline",
      link: true,
      children: userManage,
    },
    {
      show: accountStore.auth("apply"),
      title: "试用管理",
      prependIcon: "mdi-account-clock-outline",
      link: true,
      children: [
        {
          title: "审核申请",
          path: "/console/apply/review",
        },
        {
          title: "试用账号",
          path: "/console/apply/account",
        },
      ],
    },
    {
      show: accountStore.auth("statistics"),
      title: "统计中心",
      prependIcon: "mdi-chart-box-outline",
      link: true,
      children: [
        {
          title: "学员",
          path: "/console/dc/student",
        },
        {
          title: "考试",
          path: "/console/dc/exam",
        },
      ],
    },
    {
      show: accountStore.auth("dc"),
      title: "系统数据",
      prependIcon: "mdi-database-cog-outline",
      link: true,
      children: [
        {
          title: "数据库",
          path: "/console/system/database",
        },
        {
          title: "字典管理",
          path: "/console/system/dict",
        },
        {
          title: "参数设置",
          path: "/console/system/parameter-setting",
        },
        {
          title: "日志管理",
          path: "/console/system/log",
        },
      ],
    },
  ]);

  const items = computed(() => {
    return [
      ...defaultManage.value,
      ...courseManage.value,
      ...courseRegister.value,
    ].filter((item) => item.show || item.show == null);
  });

  const loadUserManage = async () => {
    userManage.value = [];
    const roles = (await roleStore.items()) as any;
    userManage.value.push(
      {
        title: "权限列表",
        path: "/console/user/permission",
      },
      {
        title: "角色列表",
        path: "/console/user/role",
      }
    );
    userManage.value.push(
      ...roles.map((item: { name: any; id: string }) => {
        return {
          title: item.name,
          path: "/console/user/" + item.id,
        };
      })
    );
  };

  const loadCourse = async () => {
    courseManage.value = [];
    if (accountStore.auth("course")) {
      const courses = (await CourseApi.list()) as any;
      if (courses.length > 0) {
        courseManage.value.push(
          {
            prependIcon: "mdi-human-male-board",
            type: "subheader",
            title: "教授的课程",
          },
          {
            title: "待批改",
            prependIcon: "mdi-view-dashboard-edit",
            link: true,
            path: "/console/correct",
          }
        );
        courseManage.value.push(
          ...courses.map((item: { name: string; explain: any; id: any }) => {
            return {
              avatar: item.name.charAt(0),
              title: item.name,
              subtitle: item.explain,
              path: `/console/course/${item.id}/manage`,
            };
          })
        );
      }
    }
    courseRegister.value = [];
    const registerCourses = (await CourseApi.getRegisterCourse()) as any;
    if (registerCourses.length > 0) {
      courseRegister.value.push({
        prependIcon: "mdi-school-outline",
        type: "subheader",
        title: "已注册",
      });
      courseRegister.value.push(
        ...registerCourses.map(
          (item: { name: string; explain: any; id: any }) => {
            return {
              avatar: item.name.charAt(0),
              title: item.name,
              subtitle: item.explain,
              path: `/console/course/${item.id}`,
            };
          }
        )
      );
    }
  };

  return {
    items,
    loadUserManage,
    loadCourse,
  };
});
