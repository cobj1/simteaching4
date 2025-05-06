import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { CourseApi } from "@/api/course/course";
import { useRoleStore } from "@/stores/role";

export const useConsoleStore = defineStore("console", () => {
  const accountStore = useAccountStore();
  const roleStore = useRoleStore();

  const userManage = ref<{ title : string; path : string }[]>([]);
  const courseManage = ref<
    {
      prependIcon ?: string;
      type ?: string;
      title : string;
      link ?: boolean;
      path ?: string;
      show ?: boolean;
    }[]
  >([]);
  const courseRegister = ref<
    {
      prependIcon ?: string;
      type ?: string;
      avatar ?: string;
      subtitle ?: string;
      path ?: string;
      title : string;
      show ?: boolean;
    }[]
  >([]);
  const defaultManage = ref<any[]>([]);

  const items = computed(() => {
    return [
      ...courseManage.value,
      ...courseRegister.value,
      ...defaultManage.value,
    ].filter((item) => item.show || item.show == null);
  });

  const loadDefaultManage = async () => {
    defaultManage.value = [
      {
        type: "divider",
      },
      {
        title: "后台首页",
        prependIcon: "mdi-home-outline",
        link: true,
        path: "/console/home",
      },
      {
        show: accountStore.auth("course"),
        title: "课程教学管理",
        prependIcon: "mdi-school-outline",
        link: true,
        children: [
          {
            title: "实验报告撰写",
            path: "/console/resource/report-template",
          },
          {
            title: "教学智能测评",
            path: "/console/stats/VirtualLabStats",
          },
        ],
      },
      {
        show: accountStore.auth("resource"),
        title: "资源库管理",
        prependIcon: "mdi-library-outline",
        link: true,
        children: [
          {
            title: "课件资源库",
            path: "/console/resource/courseware",
          },
          {
            title: "仿真资源库",
            path: "/console/resource/simulation",
          },
          {
            title: "试题资源库",
            path: "/console/resource/testpaper",
          },
          {
            title: "实验库",
            path: "/console/resource/questions",
          },
          {
            show: accountStore.auth("course"),
            title: "课程库",
            path: "/console/course/manage",
          },
          {
            show: accountStore.auth("course-check"),
            title: "课程审核",
           /* prependIcon: "mdi-check-network-outline",
            link: true, */
            path: "/console/course/check",
          },
        ],
      },
      {
        show: accountStore.auth("share"),
        title: "共享系统",
        prependIcon: "mdi-share-variant-outline",
        link: true,
        path: "/console/resource/share",
      },
      {
        show: accountStore.auth("statistics"),
        title: "教学大数据统计",
        prependIcon: "mdi-chart-box-outline",
        link: true,
        children: [
          {
            title: "教学过程数据统计",
            path: "/console/stats/course-browse",
          },
          {
            title: "教学结果数据统计",
            path: "/console/stats/statistics",
          },
          {
            title: "教务数据统计",
            path: "/console/stats/visit-statistics",
          },
        ],
      },
      {
        show: accountStore.auth("declare"),
        title: "平台功能服务拓展",
        prependIcon: "mdi-book-cog-outline",
        link: true,
        children: [
          {
            show: accountStore.auth("site"),
            title: "门户展示平台",
            path: "/console/site",
          },
          {
            title: "申报服务平台",
            path: "/console/declare/manage",
          },
          {
            title: "申报服务审核",
            path: "/console/declare/check",
          },
          {
            show: accountStore.auth("statistics"),
            title: "数据统计与质量监督平台",
            path: "/console/stats/role-statistics",
          },
        ],
      },
      {
        show: accountStore.auth("user"),
        title: "教务功能管理平台",
        prependIcon: "mdi-account-cog-outline",
        link: true,
        children: userManage,
      },
      {
        show: accountStore.auth("homework"),
        title: "作业管理",
        prependIcon: "mdi-book-open-variant-outline",
        link: true,
        children: [
          {
            title: "作业列表",
            path: "/console/homework/manage",
          },
          {
            title: "作业审批",
            path: "/console/homework/examine",
          },
        ],
      },
      {
        show: accountStore.auth("attendance"),
        title: "考勤登录",
        prependIcon: "mdi-login-variant",
        link: true,
        path: "/console/attendance",
      },
      {
        show: accountStore.auth("sign-in"),
        title: "签到管理",
        prependIcon: "mdi-clipboard-account-outline",
        link: true,
        path: "/console/sign-in",
      },
      {
        show: accountStore.auth("notice"),
        title: "通知公告",
        prependIcon: "mdi-bell-cog-outline",
        link: true,
        path: "/console/notice",
      },
      {
        show: accountStore.auth("org"),
        title: "组织管理",
        prependIcon: "mdi-bank",
        link: true,
        path: "/console/org",
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
            title: "日志管理",
            path: "/console/system/log",
          },
        ],
      },
    ];
  };
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
      ...roles.map((item : { name : any; id : string }) => {
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
        courseManage.value.push({
          prependIcon: "mdi-human-male-board",
          type: "subheader",
          title: "课程教学管理",
        });
        courseManage.value.push(
          ...courses.map((item : { name : string; explain : any; id : any }) => {
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
          (item : { name : string; explain : any; id : any }) => {
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
    loadDefaultManage,
    loadUserManage,
    loadCourse,
  };
});
