<template>
  <v-dialog activator="parent" max-width="900" scrollable :fullscreen="fullscreen || $vuetify.display.smAndDown"
    @after-enter="handleAfterEnter">
    <template v-slot:default="{ isActive }">
      <v-card prepend-icon="mdi-scoreboard-outline" title="设置课程分数权重" :loading="loading">
        <template #append v-if="!$vuetify.display.smAndDown">
          <v-btn :icon="fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
            @click="fullscreen = !fullscreen"></v-btn>
        </template>
        <v-divider class="mt-3"></v-divider>

        <v-card-text class="px-4 bg-surface-light" style="max-height: 50vh; min-height: 300px;">

          <v-list class="py-0" item-props :items="items" lines="two" rounded="lg">
            <template #item="{ props: itemProps }">
              <v-list-item link :subtitle="itemProps.subname" :title="itemProps.name">
                <template #prepend>
                  <v-avatar class="pa-7" color="surface-light" rounded="lg" size="50">
                    <v-avatar :color="itemProps.color" :icon="itemProps.icon" rounded>
                      <v-icon color="white" />
                    </v-avatar>
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-list>

        </v-card-text>

        <v-divider></v-divider>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn text="关闭" variant="plain" @click="isActive.value = false"></v-btn>

          <v-btn color="primary" text="保存" variant="tonal" @click="isActive.value = false"></v-btn>
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { CourseResourceApi } from '@/api/course/course-resource';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const loading = ref(true)
const fullscreen = ref(false)

const items = [
  {
    name: '(Zero) Master Service Agreement',
    color: 'info',
    icon: 'mdi-text-long',
    subname: 'You opened today',
  },
  {
    name: 'Role: Lead Backend Engineer',
    color: 'info',
    icon: 'mdi-text',
    subname: 'John Doe shared today',
  },
  {
    name: 'Design System Inventory',
    color: 'success',
    icon: 'mdi-pencil-ruler',
    subname: 'You opened in the past month',
  },
  {
    name: 'Discuss: Zero product design',
    color: 'amber',
    icon: 'mdi-rectangle-outline',
    subname: 'You opened in the past month',
  },
  {
    name: 'DRAFT',
    color: 'amber',
    icon: 'mdi-note-multiple-outline',
    subname: 'You opened in the past year',
  },
  {
    name: 'Zero Glossary',
    color: 'info',
    icon: 'mdi-text',
    subname: 'You opened in the past year',
  },
]

const handleAfterEnter = () => {
  loadResources()
}

const loadResources = async () => {
  loading.value = true;
  const res = await CourseResourceApi.list(route.params.id)
  console.log(res)
  loading.value = false;
}

</script>

<style scoped></style>
