<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" disable-resize-watcher class="position-fixed">
      <v-list nav>
        <v-list-subheader>控制台</v-list-subheader>
        <div v-for="(item) in items" :key="item.title">
          <v-divider v-if="item.type == 'divider'"></v-divider>
          <div v-if="item.type == 'subheader'">
            <v-divider></v-divider>
            <v-list-subheader> {{ item.title }} </v-list-subheader>
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
import { CourseApi } from '@/api/course';
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

const userManage = ref([{
  title: '权限列表',
  path: '/manage/user/permission'
},
{
  title: '角色列表',
  path: '/manage/user/role'
}
])
const courseManage = ref([])
const defaultManage = ref([
  {
    title: '后台首页',
    prependIcon: 'mdi-home-outline',
    link: true,
    path: '/manage'
  },
  {
    title: '课程管理',
    prependIcon: 'mdi-school-outline',
    link: true,
    path: '/manage/course'
  },
  {
    title: '资源库',
    prependIcon: 'mdi-library-outline',
    link: true,
    children: [
      {
        title: '课件',
        path: '/manage/resource/courseware'
      },
      {
        title: '仿真',
        path: '/manage/resource/simulation'
      },
      {
        title: '题库',
        path: '/manage/resource/questions'
      },
      {
        title: '测试',
        path: '/manage/resource/testpaper'
      },
    ]
  },
  {
    title: '共享资源库',
    prependIcon: 'mdi-share-variant-outline',
    link: true,
    path: '/manage/resource/share'
  },
  {
    title: '考勤管理',
    prependIcon: 'mdi-calendar-check-outline',
    link: true,
    path: '/manage/attendance'
  },
  {
    title: '通知公告',
    prependIcon: 'mdi-bell-cog-outline',
    link: true,
    path: '/manage/notice'
  },
  {
    title: '门户管理',
    prependIcon: 'mdi-web',
    link: true,
    path: '/manage/site'
  },
  {
    title: '组织管理',
    prependIcon: 'mdi-bank',
    link: true,
    path: '/manage/org'
  },
  {
    title: '用户管理',
    prependIcon: 'mdi-account-cog-outline',
    link: true,
    children: userManage
  },
  {
    title: '试用管理',
    prependIcon: 'mdi-account-clock-outline',
    link: true,
    children: [
      {
        title: '审核申请',
        path: '/manage/apply/review'
      },
      {
        title: '试用账号',
        path: '/manage/apply/account'
      }
    ]
  },
  {
    title: '统计中心',
    prependIcon: 'mdi-chart-box-outline',
    link: true,
    children: [
      {
        title: '学员',
        path: '/manage/dc/student'
      }, {
        title: '考试',
        path: '/manage/dc/exam'
      }
    ]
  },
  {
    title: '系统数据',
    prependIcon: 'mdi-database-cog-outline',
    link: true,
    children: [
      {
        title: '数据库',
        path: '/manage/system/database'
      },
      {
        title: '字典管理',
        path: '/manage/system/dict'
      },
      {
        title: '参数设置',
        path: '/manage/system/parameter-setting'
      },
      {
        title: '日志管理',
        path: '/manage/system/log'
      }
    ]
  },
  {
    type: 'subheader',
    title: '教授的课程',
  },
  {
    title: '待批改',
    prependIcon: 'mdi-view-dashboard-edit',
    link: true,
    path: '/manage/correct'
  },
])


const items = computed(() => {
  return [...defaultManage.value, ...courseManage.value]
})



const loadUserManage = async () => {
  const roles = await roleStore.items()
  userManage.value.push(...roles.map(item => {
    return {
      title: item.name,
      path: '/manage/user/' + item.id
    }
  }))
}

const loadCourse = async () => {
  const courses = await CourseApi.list()
  courseManage.value.push(...courses.map(item => {
    return {
      avatar: item.name.charAt(0),
      title: item.name,
      subtitle: item.explain,
      path: '/manage/course/' + item.id
    }
  }))
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
