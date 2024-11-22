<template>
  <v-sheet>
    <v-breadcrumbs
      :items="[{ title: '首页', disabled: false, href: '/home' }, { title: data.title, disabled: true }]"></v-breadcrumbs>
  </v-sheet>
  <v-divider></v-divider>
  <v-sheet min-height="70vh" rounded="lg">
    <v-container class="pa-sm-6 pa-md-12" fluid>
      <v-responsive class="text-center mx-auto pb-4 border-b-sm" max-width="900">
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
      <v-skeleton-loader :loading="loading" type="paragraph,paragraph,paragraph,paragraph">
        <v-container>
          <pre style="text-align: justify;" wrap="soft" v-html="data.content"></pre>
          <p style="text-align: justify;">&nbsp;</p>
        </v-container>
      </v-skeleton-loader>
    </v-container>
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
}
onMounted(() => load())
</script>
