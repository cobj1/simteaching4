<template>
  <v-empty-state headline="Welcome" icon="mdi-bird" title="你今天想做什么？">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card link prepend-icon="mdi-school-outline" @click="router.push('/manage/course')"
            text="用户可以通过该功能创建新的课程，并添加相关的描述、标签、类别等信息。" title="创建课程"></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card link prepend-icon="mdi-test-tube" @click="router.push('/manage/resource/testpaper')"
            text="试题目的添加、编辑和删除；以及测试设置。" title="创建测试"></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card link prepend-icon="mdi-head-question" @click="router.push('/manage/resource/questions')"
            text="该功能支持多种题型，如单选题、多选题、简答题等。" title="添加题目"></v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card link prepend-icon="mdi-account-cog-outline" @click="router.push('/manage/user/ae98e30b-aca1-11ef-9067-00163e3a3360')"
            text="该功能允许管理员或教师查看、添加和管理学员信息。" title="添加学员"></v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-empty-state>
</template>


<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
</script>

<style lang="scss" scoped></style>
