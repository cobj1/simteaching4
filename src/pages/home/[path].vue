<template>
  <v-container max-width="1600px">
    <v-row>
      <v-col cols="4" lg="3" xl="2" v-if="$vuetify.display.mdAndUp">
        <v-sheet rounded="lg">
          <v-list rounded="lg">
            <v-list-subheader>目录</v-list-subheader>
            <v-skeleton-loader :loading="loading" type="paragraph,paragraph">
              <v-responsive>
                <v-list-item v-for="item in items" :key="item.id" :title="item.title" link
                  @click="router.push(item.link)"></v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-empty-state v-if="empty" title="列表暂为空"></v-empty-state>
              </v-responsive>
            </v-skeleton-loader>
            <v-list-item color="grey-lighten-4" title="刷新" link @click="loadItems"></v-list-item>
          </v-list>
        </v-sheet>
      </v-col>
      <v-col>
        <v-skeleton-loader :loading="loading" type="list-item,list-item,paragraph,paragraph,paragraph,paragraph,paragraph,paragraph"  >
          <v-responsive>
            <router-view></router-view>
            <v-empty-state v-if="empty" headline="还没有消息" title="稍后再来查看。" height="800px"
              text="当前模块没有收到任何消息，可以前往其他模块查看信息。"></v-empty-state>
          </v-responsive>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { SiteApi } from '@/api/site';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const empty = ref(false)
const loading = ref(true)

const items = ref<{ id: string, title: string, link: string }[]>([])

watch(() => route.params.path, () => {
  loading.value = true
  loadItems()
})

watch(() => [route.params.path, route.params.id], (val, last) => {
  if (val[0] == last[0] && !route.params.id) {
    defaultContent()
  }
})

const defaultContent = () => {
  if (items.value.length > 0) {
    router.push(items.value[0].link)
  } else {
    empty.value = true
  }
}

const loadItems = async () => {
  empty.value = false
  const siteType = await SiteApi.typeOne({ path: route.params.path }) as any
  const res = await SiteApi.page({ current: 1, size: 20, typeId: siteType.id }) as any
  items.value = res.records.map((item: { id: any; }) => {
    return {
      ...item,
      link: `/home/${route.params.path}/${item.id}`
    }
  })
  if (!route.params.id) defaultContent()
  setTimeout(() => loading.value = false, 300)
}

onMounted(() => {
  loadItems()
})
</script>

<style scoped></style>
