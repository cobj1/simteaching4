<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" class="position-fixed	">
      <v-list density="compact" nav>
        <v-list-subheader>Navigation</v-list-subheader>
        <div v-for="(item) in items" :key="item.title">
          <v-list-item v-if="item.children == null || item.children.length == 0" :value="item" color="primary"
            @click="router.push(item.path)">
            <template v-slot:prepend> <v-icon :icon="item.prependIcon"></v-icon> </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
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
        <v-list-item class="ma-2" link nav prepend-icon="mdi-cog-outline" title="Settings" />
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
        <!-- <v-sheet border="dashed md" color="surface-light" height="500" rounded="lg" width="100%" /> -->
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { RoleApi } from '@/api/role';
import vuetify from '@/plugins/vuetify';
import { useAccountStore } from '@/stores/account';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';

const account = useAccountStore()
const router = useRouter()
const drawer = ref(!vuetify.display.smAndDown.value)
const userManage = ref([{
  title: '权限列表',
  path: '/manage/user/permission'
},
{
  title: '角色列表',
  path: '/manage/user/role'
}
])

const items = ref([
  {
    title: '后台首页',
    prependIcon: 'mdi-view-dashboard-outline',
    link: true,
    path: '/manage'
  },
  {
    title: '组织管理',
    prependIcon: 'mdi-account-group',
    link: true,
    path: '/manage/org'
  },
  {
    title: '用户管理',
    prependIcon: 'mdi-account-group',
    link: true,
    children: userManage
  },
  {
    title: '系统管理',
    prependIcon: 'mdi-briefcase-outline',
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
    title: '试用管理',
    prependIcon: 'mdi-briefcase-outline',
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
    title: '资源管理',
    prependIcon: 'mdi-briefcase-outline',
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
    ]
  },
  {
    title: '共享资源库',
    prependIcon: 'mdi-calendar',
    link: true,
    path: '/manage/resource/share'
  },
  {
    title: '考勤管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
  },
  {
    title: '课程管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
    path: '/manage/course'
  },
  {
    title: '作业管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
    path: '/manage/homework'
  },
  {
    title: '考试管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
    children: [
      {
        title: '考试',
        path: '/manage/exam'
      },
      {
        title: '试卷',
        path: '/manage/exam/testpaper'
      },
      {
        title: '题库',
        path: '/manage/resource/questions'
      },
    ]
  },
  {
    title: '数据中心',
    prependIcon: 'mdi-file-chart-outline',
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
    title: '通知公告',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
    path: '/manage/notice'
  },
  {
    title: '门户管理',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
    path: '/manage/site'
  },
])


onMounted(async () => {
  if (account.token) {
    const roles = await RoleApi.listByUserPermission()
    userManage.value.push(...roles.map(item => {
      return {
        title: item.name,
        path: '/manage/user/' + item.id
      }
    }))
  }

})
</script>
<style scoped>
.v-layout {
  height: 100%;
}
</style>
