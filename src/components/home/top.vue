<template>
  <div class="header-right">
    <div style="width: 320px;">
      <span>校级平台</span>
    </div>
    <div style="display: flex;  width: 1250px; height: 60px; background-color: #ece0d2;">
      <img style="display: block; margin-left: auto; margin-right: auto;margin-top: auto; margin-bottom: auto; "
        src="/image/top.png" />
    </div>
  </div>
  <div style="display: flex;justify-content: space-between; width: 1250px; margin: auto;position: relative;">
    <el-menu router class="el-menu-demo" mode="horizontal" background-color="#7a5b38" text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item style=" width: 100px; font-size: 16px;" index="/admin">首页</el-menu-item>
      <el-sub-menu index="2" popper-class="test">
        <template #title>学校概况</template>
        <el-menu-item index="/main/synopsis">学校简介</el-menu-item>
        <el-menu-item index="/main/famous">学校名师</el-menu-item>
        <el-menu-item index="/main/campus">校园风光</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3" popper-class="test">
        <template #title>学校新闻</template>
        <el-menu-item index="/news/notice">通知公告</el-menu-item>
        <el-menu-item index="/news/flash">新闻快讯</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4" popper-class="test">
        <template #title>德育天地</template>
        <el-menu-item index="/moral/gym">阳光体育活动</el-menu-item>
        <el-menu-item index="/moral/student-style">学生风采</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div v-if="tokenStore.getToken()" popper-class="test"
      style="position: absolute; right: 0;color: #fff; display: flex; align-items: center;padding: 8px; line-height: 40px;">
      欢迎 <b style="padding: 0 10px;">{{ accountStore.user.name }}</b>
      <el-button v-if="permissionStore.module == 'manage'" @click="switchModule('manage')">
        前往管理端 <i class="fa fa-arrow-circle-o-right"></i>
      </el-button>
      <el-button v-if="permissionStore.module == 'app'" @click="switchModule('app')">
        前往学员端 <i class="fa fa-arrow-circle-o-right"></i>
      </el-button>
    </div>
    <div v-else popper-class="test" style="position: absolute; right: 0;">
      <el-button link style="color: #fff; padding: 20px" @click="router.push('/login')">登录</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePermissionStore } from '../../stores/permission.js'
import { useAccountStore } from '../../stores/account.js'
import { useRouter } from 'vue-router'
import { useTokenStore } from '../../stores/token.js'

const permissionStore = usePermissionStore()
const accountStore = useAccountStore()
const router = useRouter()
const tokenStore = useTokenStore()

const switchModule = (module) => {
  permissionStore.SET_MODULE(module)
  accountStore.removeAuthority()
  router.push('/redirect/' + module)
}
</script>

<style lang="scss" scoped>
.header-right {
  display: flex;
  align-items: center;
  background: #ecc9aa;
  max-height: 85px;
  margin: auto;
  width: 1250px;

  >* {
    margin-top: 25px;
    margin-bottom: 25px;
  }

  span {
    font-size: 3.5ch;
    color: #ffffff;
  }
}

.el-menu-demo {
  width: 100%;
}
</style>
