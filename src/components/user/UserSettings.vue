<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" max-width="800"
    :fullscreen="$vuetify.display.smAndDown">
    <v-card>
      <v-toolbar>
        <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        <v-toolbar-title>用户设置</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container class="pa-6 pa-md-12 my-16 d-flex align-center" fluid>
        <v-row align="center" dense>
          <v-col cols="12" md="8">
            <h1 class="font-weight-bold mb-4 text-h4">
              积分
            </h1>

            <p class="mb-4 text-subtitle-2 font-weight-bold text-medium-emphasis">
              可通过通过登录、学习、考试、作业等获取实验积分。通过积分可以选择进行获得线上教学的学分。通过学校设定的学分银行获取奖励。
            </p>

            <p class="text-medium-emphasis text-caption">
              学习系统中的积分功能并非简单的奖励机制，它是一种有效的激励工具和数据分析手段，可以帮助学习者提高学习动机和效果，增强学习体验，同时为教师和平台管理者提供数据支持，从而不断优化教学策略和系统功能。在数字化学习日益普及的今天，积分系统在学习领域的重要性日益凸显。
            </p>
          </v-col>

          <v-col cols="12" md="4">
            <v-list-item class="py-4 px-0 text-md-center text-left">
              <template #title>
                <div class="text-h4 font-weight-bold pb-2">
                  {{ accountStore.credits }}
                </div>
              </template>
            </v-list-item>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useAccountStore } from '@/stores/account';
import { watch } from 'vue';

const dialog = defineModel()

const accountStore = useAccountStore()

watch(dialog, (value) => {
  if (value) accountStore.loadCredits()
})


</script>

<style lang="scss" scoped></style>
