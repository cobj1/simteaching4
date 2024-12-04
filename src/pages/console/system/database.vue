<template>
  <div class="d-flex flex-column ga-4">
    <v-card>
      <v-toolbar title="数据驱动"></v-toolbar>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in basic" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-card>
      <v-toolbar title="数据源"></v-toolbar>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in datasource" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { SystemApi } from '@/api/system';
import { onMounted, ref } from 'vue';

const basic = ref()
const datasource = ref()

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

}

onMounted(() => {
  load()
})
</script>

<style scoped></style>
