<template>
  <v-sheet>
    <v-breadcrumbs :items="[{ title: '首页', disabled: false, href: '/home' }, { title: data.title, disabled: true }]"
      style="white-space: nowrap; overflow: hidden;">
      <template #item="{ item }">
        <v-breadcrumbs-item :title="item.title" :disabled="item.disabled"> </v-breadcrumbs-item>
        <!-- <li style="min-width: fit-content;">{{ item.title }}</li> -->
      </template>
    </v-breadcrumbs>
  </v-sheet>
  <v-divider></v-divider>
  <v-sheet min-height="400px" rounded="lg">
    <v-responsive class="text-center mx-auto pb-4 mt-8" max-width="900">
      <p class="font-weight-medium text-primary">{{ type.type }}</p>
      <p class="mt-2 text-h6 font-weight-bold text-md-h5">
        <v-skeleton-loader :loading="loading" type="list-item" class="justify-center">
          {{ data.title }}
        </v-skeleton-loader>
      </p>
      <p class="mt-4 text-body-1 text-medium-emphasis d-flex justify-center ga-6">
        <v-row>
          <v-col cols="12" sm="6">
            <v-skeleton-loader :loading="loading" type="list-item">
              <span class="d-flex justify-center ga-2 ">
                <v-icon icon="mdi-clock-time-five"></v-icon>
                时间：{{ data.createTime }}
              </span>
            </v-skeleton-loader>
          </v-col>
          <v-col cols="12" sm="6">
            <v-skeleton-loader :loading="loading" type="list-item">
              <span class="d-flex justify-center ga-2">
                <v-icon icon="mdi-account"></v-icon>
                报告人: {{ data.author }}
              </span>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </p>
    </v-responsive>
    <v-divider class="ma-4"></v-divider>
    <v-skeleton-loader :loading="loading" type="paragraph,paragraph,paragraph,paragraph">
      <v-container>
        <pre style="text-align: justify;" wrap="soft" v-html="data.content"></pre>
        <p style="text-align: justify;">&nbsp;</p>
      </v-container>
    </v-skeleton-loader>
  </v-sheet>
</template>

<script setup>
import { FileApi } from '@/api/file';
import { SiteApi } from '@/api/site';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const type = ref({})
const data = ref({})
const loading = ref(true)

watch(() => route.fullPath, () => load())

const load = async () => {
  loading.value = true
  type.value = await SiteApi.typeOne({ path: route.params.path })
  data.value = await SiteApi.one({ id: route.params.id })
  try {
    const res = await FileApi.downloadTxt(data.value.content)
    data.value.content = res
  } catch (e) { /* empty */ }
  loading.value = false
  window.scrollTo(0, 0)
}
onMounted(() => load())
</script>
