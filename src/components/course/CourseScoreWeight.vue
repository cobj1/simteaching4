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

        <v-card-text class="px-4 bg-surface-light" style="min-height: 300px;"
          :style="{ 'max-height': $vuetify.display.smAndUp ? '70vh' : '100%' }">

          <v-list class="py-0 pt-6" item-props :items="items" lines="two" rounded="lg">
            <template #item="{ props: itemProps }">
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-list-item v-bind="props" :subtitle="itemProps.type" :title="itemProps.resource.name">
                    <template #prepend>
                      <VResourceIcon size="50" :type="itemProps.type"></VResourceIcon>
                    </template>
                    <template #append>
                      <div class="d-flex flex-column align-end">
                        <v-slider v-model="items[itemProps.order].weight" thumb-label="always" hide-details step="0.1"
                          width="200px" :disabled="!isHovering"></v-slider>
                        <div class="ml-2 text-end d-flex align-end">
                          <v-text-field v-model="items[itemProps.order].weight" type="number" variant="underlined"
                            hide-details density="compact" :min="1" :max="100" width="60px"
                            :disabled="!isHovering"></v-text-field>
                          / 100.00
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                </template>
              </v-hover>
            </template>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>
        <template v-slot:actions>
          <div :class="{ 'text-red': totalWeight > 100 }">{{ totalWeight }}</div> / 100.00

          <v-spacer></v-spacer>

          <v-btn text="关闭" variant="plain" @click="isActive.value = false"></v-btn>

          <v-btn color="primary" text="保存" variant="tonal" :disabled="totalWeight > 100" @click="save"></v-btn>
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { CourseResourceApi } from '@/api/course/course-resource';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const loading = ref(true)
const fullscreen = ref(false)

const items = ref([])

const totalWeight = computed(() => items.value.reduce((pre, current) => pre + current.weight, 0))

const handleAfterEnter = () => {
  loadResources()
}

const save = () => {
  console.log(items.value)
}

const loadResources = async () => {
  loading.value = true;
  const res = await CourseResourceApi.list(route.params.id)
  items.value = res.map(item => {
    item.weight = 0
    return item;
  })
  loading.value = false;
}

</script>

<style scoped></style>
