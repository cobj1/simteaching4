<template>
  <div class="d-flex flex-column ga-4">
    <iframe src="http://localhost:8084/druid/login.html" height="800"></iframe>
  </div>
</template>

<script setup lang="ts">
  import { SystemApi } from '@/api/system';
  import { onMounted, ref } from 'vue';

  const basic = ref()
  const datasource = ref()
  const websession = ref()
  const tab = ref()

  const load = async () => {
    const basicRes = await SystemApi.basic() as any
    if (basicRes) {
      basic.value = Object.keys(basicRes).map(key => {
        return {
          name: key,
          value: basicRes[key],
        }
      })
    }
    const datasourceRes = await SystemApi.datasource() as any
    if (datasourceRes && datasourceRes[0]) {
      datasource.value = Object.keys(datasourceRes[0]).map(key => {
        return {
          name: key,
          value: datasourceRes[0][key],
        }
      })
    }
    const sessionRes = await SystemApi.sql() as any
    console.log(sessionRes)
    if (sessionRes) {
      websession.value = Object.keys(sessionRes).map(key => {
        return {
          name: key,
          value: sessionRes[0][key],
        }
      })
    }
  }

  onMounted(() => {
    load()
  })
</script>

<style scoped></style>
