<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher class="position-fixed">
      <v-list nav>
        <v-list-subheader>
          <div class="d-flex align-center ga-1">
            <v-icon icon="mdi-console"></v-icon>
            控制台
          </div>
        </v-list-subheader>
        <div v-for="(item) in items" :key="item.title">
          <v-divider v-if="item.type == 'divider'"></v-divider>
          <div v-if="item.type == 'subheader'">
            <v-divider></v-divider>
            <v-list-subheader>
              <div class="d-flex align-center ga-1">
                <v-icon :icon="item.prependIcon"></v-icon>
                {{ item.title }}
              </div>
            </v-list-subheader>
          </div>
          <v-list-item v-else-if="item.children == null || item.children.length == 0" :value="item" color="primary"
            @click="router.push(item.path)">
            <template v-slot:prepend>
              <v-icon :icon="item.prependIcon" v-if="item.prependIcon"></v-icon>
              <v-avatar v-if="item.avatar" color="blue-darken-3" size="32" icon="item.avatar" class="mr-2 ">
                {{ item.avatar }}</v-avatar>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-group v-else :value="item.title">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" color="primary">
                <template v-slot:prepend> <v-icon :icon="item.prependIcon"></v-icon> </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-for="(child) in item.children" :key="child.title" :value="child" color="primary"
              @click="router.push(child.path)">
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
      <template #append>
        <SystemSettings> </SystemSettings>
      </template>
    </v-navigation-drawer>

    <v-app-bar border="b" class="ps-4 position-fixed" flat>
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />
      <v-app-bar-title>智慧教育云仿真管理平台</v-app-bar-title>
      <template #append>
        <v-btn icon class="mr-4">
          <v-icon icon="mdi-plus"></v-icon>
          <CourseRegister></CourseRegister>
        </v-btn>
        <ThemeSwitch></ThemeSwitch>
        <UserPanel></UserPanel>
      </template>
    </v-app-bar>
    <v-main>
      <div class="pa-4">
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { CourseApi } from '@/api/course/course';
import vuetify from '@/plugins/vuetify';
import { useAccountStore } from '@/stores/account';
import { useRoleStore } from '@/stores/role';
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';

const account = useAccountStore()
const roleStore = useRoleStore()
const router = useRouter()
const drawer = ref(!vuetify.display.smAndDown.value)

watch(() => vuetify.display.smAndDown.value, (value) => drawer.value = !value)

const userManage = ref([])
const courseManage = ref([])
const courseRegister = ref([])
const defaultManage = ref([
  {
    title: '后台首页',
    prependIcon: 'mdi-home-outline',
    link: true,
    path: '/console'
  },
  {
    show: account.auth('course'),
    title: '课程管理',
    prependIcon: 'mdi-school-outline',
    link: true,
    path: '/console/course'
  },
  {
    show: account.auth('resource'),
    title: '资源库',
    prependIcon: 'mdi-library-outline',
    link: true,
    children: [
      {
        title: '资料',
        path: '/console/resource/courseware'
      },
      {
        title: '仿真',
        path: '/console/resource/simulation'
      },
      {
        title: '题库',
        path: '/console/resource/questions'
      },
      {
        title: '测试',
        path: '/console/resource/testpaper'
      },
    ]
  },
  {
    show: account.auth('share'),
    title: '共享资源库',
    prependIcon: 'mdi-share-variant-outline',
    link: true,
    path: '/console/resource/share'
  },
  {
    show: account.auth('attendance'),
    title: '考勤管理',
    prependIcon: 'mdi-calendar-check-outline',
    link: true,
    path: '/console/attendance'
  },
  {
    show: account.auth('notice'),
    title: '通知公告',
    prependIcon: 'mdi-bell-cog-outline',
    link: true,
    path: '/console/notice'
  },
  {
    show: account.auth('site'),
    title: '门户管理',
    prependIcon: 'mdi-web',
    link: true,
    path: '/console/site'
  },
  {
    show: account.auth('org'),
    title: '组织管理',
    prependIcon: 'mdi-bank',
    link: true,
    path: '/console/org'
  },
  {
    show: account.auth('user'),
    title: '用户管理',
    prependIcon: 'mdi-account-cog-outline',
    link: true,
    children: userManage
  },
  {
    show: account.auth('apply'),
    title: '试用管理',
    prependIcon: 'mdi-account-clock-outline',
    link: true,
    children: [
      {
        title: '审核申请',
        path: '/console/apply/review'
      },
      {
        title: '试用账号',
        path: '/console/apply/account'
      }
    ]
  },
  {
    show: account.auth('statistics'),
    title: '统计中心',
    prependIcon: 'mdi-chart-box-outline',
    link: true,
    children: [
      {
        title: '学员',
        path: '/console/dc/student'
      }, {
        title: '考试',
        path: '/console/dc/exam'
      }
    ]
  },
  {
    show: account.auth('dc'),
    title: '系统数据',
    prependIcon: 'mdi-database-cog-outline',
    link: true,
    children: [
      {
        title: '数据库',
        path: '/console/system/database'
      },
      {
        title: '字典管理',
        path: '/console/system/dict'
      },
      {
        title: '参数设置',
        path: '/console/system/parameter-setting'
      },
      {
        title: '日志管理',
        path: '/console/system/log'
      }
    ]
  },

])


const items = computed(() => {
  return [...defaultManage.value, ...courseManage.value, ...courseRegister.value].filter(item => item.show || item.show == null)
})

const loadUserManage = async () => {
  const roles = await roleStore.items()
  userManage.value.push(
    {
      title: '权限列表',
      path: '/console/user/permission'
    },
    {
      title: '角色列表',
      path: '/console/user/role'
    }
  )
  userManage.value.push(...roles.map(item => {
    return {
      title: item.name,
      path: '/console/user/' + item.id
    }
  }))
}

const loadCourse = async () => {
  const courses = await CourseApi.list()
  if (courses.length > 0) {
    courseManage.value.push(
      {
        prependIcon: 'mdi-human-male-board',
        type: 'subheader',
        title: '教授的课程',
      },
      {
        title: '待批改',
        prependIcon: 'mdi-view-dashboard-edit',
        link: true,
        path: '/console/correct'
      }
    )
    courseManage.value.push(...courses.map(item => {
      return {
        avatar: item.name.charAt(0),
        title: item.name,
        subtitle: item.explain,
        path: `/console/course/${item.id}/manage`
      }
    }))
  }
  if (true) {
    courseManage.value.push({
      prependIcon: 'mdi-school-outline',
      type: 'subheader',
      title: '已注册',
    })
    courseRegister.value.push(...courses.map(item => {
      return {
        avatar: item.name.charAt(0),
        title: item.name,
        subtitle: item.explain,
        path: `/console/course/${item.id}`
      }
    }))
  }
}


onMounted(async () => {
  if (account.token) {
    loadUserManage()
    loadCourse()
  }
})
</script>
<style scoped>
.v-layout {
  height: 100%;
}
</style>
