<template>
  <v-container fluid max-width="1000px" min-height="800px">
    <v-card class="mx-auto">
      <v-img class="align-end text-white pa-4" height="200" src="@/assets/course/tab-info-bg.jpg" cover>
        <div class="w-100 h-100 position-absolute left-0 top-0 opacity-80 d-print-block"
          style=" background-image: radial-gradient(25rem 18.75rem ellipse at bottom right, #202124, transparent);  ">
        </div>
        <v-card-title>{{ data.name }}</v-card-title>
        <v-card-subtitle>{{ data.explain }}</v-card-subtitle>
      </v-img>
      <v-card-text class="pa-8">
        <v-row>
          <v-col cols="12 py-2" v-if="manage">
            <strong class="mr-2">课程代码 </strong> {{ data.code }}
          </v-col>
          <v-col cols="12 py-2">
            <strong class="mr-2">主题</strong> {{ data.subject }}
          </v-col>
          <v-col cols="12 py-2">
            <strong class="mr-2">教室</strong> {{ data.classroom }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row class="mt-4">
      <v-col cols="12" md="3" v-if="manage">
        <v-card title="课程代码">
          <v-card-text class="text-h6 text-blue-darken-3 font-weight-medium"> {{ data.code }} </v-card-text>
          <template #append>
            <CourseCodeOptions :id="data.id" :code="data.code" @change="emit('change')"></CourseCodeOptions>
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" md="9" v-if="manage">
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
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  data: Object,
  manage: Boolean
})
const emit = defineEmits(['change'])
const text = ref('')

</script>

<style lang="scss" scoped></style>
