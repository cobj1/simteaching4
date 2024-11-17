<template>
  <v-empty-state
    headline="Welcome"
    icon="$vuetify"
    title="你今天想做什么？"
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            prepend-icon="$vuetify"
            target="_blank"
            text="用户可以通过该功能创建新的课程，并添加相关的描述、标签、类别等信息。"
            title="创建课程"
          ></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://play.vuetifyjs.com"
            prepend-icon="$vuetify-play"
            target="_blank"
            text="试题目的添加、编辑和删除；以及考试设置，如考生参加方式、考试次数等。"
            title="创建考试"
          ></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://bin.vuetifyjs.com"
            prepend-icon="mdi-delete"
            target="_blank"
            text="该功能支持多种题型，如单选题、多选题、填空题等，并允许用户编辑题目的详细信息，包括题干、选项、答案、解析等。"
            title="添加题目"
          ></v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card
            href="https://issues.vuetifyjs.com"
            prepend-icon="$warning"
            target="_blank"
            text="该功能允许管理员或教师查看、添加和管理学员信息，包括学员的购买课程情况、上课情况等。"
            title="添加学员"
          ></v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-empty-state>
</template>