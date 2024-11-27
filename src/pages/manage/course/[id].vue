<template>
  <VCard>
    <VToolbar :title="data.name">
    </VToolbar>
    <v-sheet elevation="3" rounded="lg">
      <v-tabs v-model="tab" :items="tabs" height="50" slider-color="#f78166" class="pl-4 ">
        <template v-slot:tab="{ item }">
          <v-tab :prepend-icon="item.icon" :text="item.text" :value="item.value" class="text-none"></v-tab>
        </template>
      </v-tabs>
      <VDivider></VDivider>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="info">
          <v-container fluid max-width="1000px" min-height="800px">
            <v-card class="mx-auto">
              <v-img class="align-end text-white pa-4" height="200" src="@/assets/course/tab-info-bg.jpg" cover>
                <div class="w-100 h-100 position-absolute left-0 top-0 opacity-80 d-print-block"
                  style=" background-image: radial-gradient(25rem 18.75rem ellipse at bottom right, #202124, transparent);  ">
                </div>
                <v-card-title>{{ data.name }}</v-card-title>
                <v-card-subtitle>{{ data.explain }}</v-card-subtitle>
              </v-img>
              <v-card-text class="pt-4 px-8">
                <v-row>
                  <v-col cols="12 py-1">
                    <strong class="mr-2">课程代码</strong> {{ data.code }}
                  </v-col>
                  <v-col cols="12 py-1">
                    <strong class="mr-2">主题</strong> {{ data.subject }}
                  </v-col>
                  <v-col cols="12 py-1">
                    <strong class="mr-2">教室</strong> {{ data.classroom }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-row class="mt-4">
              <v-col cols="12" md="3">
                <v-card title="课程代码">
                  <v-card-text class="text-h6 text-blue-darken-3 font-weight-medium"> {{ data.code }} </v-card-text>
                  <template #append>
                    <CourseCodeOptions :id="data.id" :code="data.code" @change="loadItem"></CourseCodeOptions>
                  </template>
                </v-card>
              </v-col>
              <v-col cols="12" md="9">
                <v-card>
                  <VCardText>
                    <v-textarea v-model="text" label="发布课程通知"></v-textarea>
                    <div class="text-right">
                      <v-btn color="per" :disabled="text.length == 0">发布</v-btn>
                    </div>
                  </VCardText>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item value="coursework">
          <v-container fluid max-width="1000px" min-height="800px">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-plus" rounded="xl" size="large" color="#5865f2" v-bind="props">创建</v-btn>
              </template>
              <v-list class="mt-2" width="160">
                <v-list-item title="作业" prepend-icon="$vuetify" link></v-list-item>
                <v-list-item title="测试" prepend-icon="$vuetify" link></v-list-item>
                <v-list-item title="题目" prepend-icon="mdi-head-question-outline" link></v-list-item>
                <v-list-item title="资料" prepend-icon="$vuetify" link></v-list-item>
                <v-divider></v-divider>
                <v-list-item title="主题" prepend-icon="mdi-list-box-outline" link
                  @click="CourseSubjectEditRef.editItem(route.params.id, subjects.length)"></v-list-item>
              </v-list>
            </v-menu>
            <VueDraggable ref="el" v-model="list" class="mt-8 vue-draggable" group="Resources">
              <div v-for="item in list" :key="item.id">
                <CourseResourceItem :item="item"></CourseResourceItem>
              </div>
            </VueDraggable>
            <v-card v-for="subitem in subjects" :key="subitem.name" style="box-shadow:none;">
              <template #title>
                {{ subitem.name }}
              </template>
              <template #subtitle>
                {{ subitem.explain }}
              </template>
              <template #append>
                <div class="mr-4">
                  <CourseSubjectOptions :item="subitem" @change="loadSubjects"
                    @rename="CourseSubjectEditRef.editItem(route.params.id, subjects.length, subitem)">
                  </CourseSubjectOptions>
                </div>
              </template>
              <v-card-text class="pa-0">
                <VueDraggable ref="el" v-model="subitem.children" class="vue-draggable" group="Resources">
                  <div v-for="item in subitem.children" :key="item.id">
                    <CourseResourceItem :item="item"></CourseResourceItem>
                  </div>
                </VueDraggable>
              </v-card-text>
            </v-card>
          </v-container>
          <CourseSubjectEdit ref="CourseSubjectEditRef"></CourseSubjectEdit>
        </v-tabs-window-item>
        <v-tabs-window-item value="user">
          <v-container fluid max-width="1000px" min-height="800px">
            user
          </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item value="grade">
          <v-container fluid max-width="1000px" min-height="800px">
            grade
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-sheet>
  </VCard>
</template>

<script setup>
import { CourseApi } from '@/api/course';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { VueDraggable } from 'vue-draggable-plus'
import { CourseSubjectApi } from '@/api/course/course-subject';

const CourseSubjectEditRef = ref()
const route = useRoute()
const data = ref({
  id: null,
  name: ''
})
const el = ref()
const tab = ref('coursework')
const tabs = ref([
  {
    icon: 'mdi-book-open-page-variant',
    text: '课程信息',
    value: 'info',
  },
  {
    icon: 'mdi-handshake-outline',
    text: '课业',
    value: 'coursework',
  },

  {
    icon: 'mdi-shield-lock-outline',
    text: '用户',
    value: 'user',
  },
  {
    icon: 'mdi-license',
    text: '成绩',
    value: 'grade',
  },
])
const text = ref('')
const list = ref([])
const subjects = ref([])

watch(() => route.params.id, () => {
  loadItem()
  loadSubjects()
})

const loadItem = async () => {
  data.value = await CourseApi.info(route.params.id)
}
const loadSubjects = async () => {
  const res = await CourseSubjectApi.list(route.params.id)
  subjects.value = res.map((item) => { return { ...item, children: [] } })
  loadResources()
}
const loadResources = async () => {
  list.value = []
}
onMounted(() => {
  loadItem()
  loadSubjects()
})
</script>

<style scoped>
.vue-draggable {
  min-height: 20px;
}

.vue-draggable:deep(.sortable-ghost .v-card) {
  box-shadow: 0px 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 3px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12)) !important;
}
</style>
