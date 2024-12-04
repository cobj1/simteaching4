<template>
  <v-dialog v-model="dialog" max-width="600" activator="parent">
    <v-card prepend-icon="mdi-plus" title="加入课程">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-card class="pa-4">
              <div class="text-body-2 mb-4 text-medium-emphasis">
                您当前登录的账号是：
              </div>
              <v-list-item :title="accountStore.info.name" :subtitle="accountStore.info.account">
                <template #prepend>
                  <v-avatar image="@/assets/avatar/default-avatar.svg" />
                </template>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12" class="mt-4">
            <v-card class="pa-4">
              <div class="text-body-2 font-weight-medium ">
                课程代码
              </div>
              <div class="text-body-2 mb-4 text-medium-emphasis">
                向您的教师询问课程代码，然后在此处输入代码。
              </div>
              <v-text-field v-model="code" label="课程代码" variant="outlined"></v-text-field>
            </v-card>
          </v-col>
          <v-col cols="12">
            <div class="pa-4 d-flex flex-column ga-1">
              <div class="text-body-2 font-weight-medium ">
                如要使用课程代码登录
              </div>
              <div class="text-caption text-medium-emphasis">* 请使用获得了授权的账号 </div>
              <div class="text-caption text-medium-emphasis">* 请使用由 5 - 7 个字母或数字组成的课程代码（不得包含空格或符号） </div>
              <div class="text-caption text-medium-emphasis">如果您无法顺利加入课程，请参阅这篇<a href="javascript:void(0)"
                  class="text-blue">帮助中心文章</a>
              </div>
            </div>
          </v-col>
        </v-row>

      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="取消" variant="plain" @click="close"></v-btn>

        <v-btn color="primary" text="确定" variant="tonal" @click="confirm"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { CourseApi } from '@/api/course/course';
import { useAccountStore } from '@/stores/account';
import { useConsoleStore } from '@/stores/console';
import { notify } from '@kyvg/vue3-notification';
import { nextTick, ref } from 'vue';

const accountStore = useAccountStore()
const consoleStore = useConsoleStore()
const dialog = ref(false)
const code = ref('')

const close = () => {
  dialog.value = false
  nextTick(() => {
    code.value = ''
  })
}

const confirm = async () => {
  const res = await CourseApi.curriculaVariable(code.value)
  await consoleStore.loadCourse()
  if (res) {
    notify({
      title: "加入课程成功",
      text: '请前往课程学习',
      type: "info",
      data: {
        icon: "mdi-checkbox-marked-circle",
      },
    });
  } else {
    notify({
      title: "加入课程失败",
      text: '请检查课程代码是否正确',
      type: "info",
      data: {
        icon: "mdi-alert-circle",
      },
    });
  }
  close()
}

</script>

<style lang="scss" scoped></style>
