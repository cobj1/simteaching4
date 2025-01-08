<template>
  <v-layout max-width="1600px" min-height="800px">
    <v-main min-height="450">
      <v-container class="py-md-12 text-center" fluid>
        <h2 class="text-h5 text-md-h4 font-weight-bold mb-2">仿真实验中心</h2>

        <p class="text-medium-emphasis w-100 w-md-50 mx-auto">
          仿真实验中心是利用计算机技术、虚拟现实技术、多媒体技术等，构建虚拟的实验环境，模拟真实实验过程的教学和科研平台。它可以用于各种学科和领域的实验教学、科学研究、工程设计、人员培训等。
        </p>
      </v-container>

      <v-divider class="mb-3" />

      <div class="d-flex justify-space-between px-4">
        <v-btn append-icon="mdi-chevron-down" class="text-none" :ripple="false" slim variant="text">
          排序

          <v-menu activator="parent">
            <v-list :lines="false">
              <v-list-item link title="Most Popular" />
              <v-list-item base-color="medium-emphasis" link title="Newest" />
              <v-list-item base-color="medium-emphasis" link title="Featured" />
            </v-list>
          </v-menu>

          <template #append>
            <v-icon color="medium-emphasis" />
          </template>
        </v-btn>

        <div v-if="$vuetify.display.mdAndUp" class="d-flex ga-2">
          <v-btn append-icon="mdi-chevron-down" class="text-none" :ripple="false" slim variant="text">
            类别

            <v-badge v-if="category.filter(v => v).length > 0" class="me-n2" :content="category.filter(v => v).length"
              inline />

            <v-menu activator="parent" :close-on-content-click="false" location="bottom end">
              <v-sheet class="pa-4 ps-3">
                <v-checkbox-btn v-for="(item, i) in categories" :key="item" v-model="category[i]" color="primary"
                  :label="item" />
              </v-sheet>
            </v-menu>

            <template #append>
              <v-icon color="medium-emphasis" />
            </template>
          </v-btn>

          <v-btn append-icon="mdi-chevron-down" class="text-none" :ripple="false" slim variant="text">
            类型

            <v-badge v-if="type.filter(v => v).length > 0" class="me-n2" :content="type.filter(v => v).length" inline />

            <v-menu activator="parent" :close-on-content-click="false" location="bottom end">
              <v-sheet class="pa-4 ps-3">
                <v-checkbox-btn v-for="(item, i) in types" :key="item" v-model="type[i]" color="primary"
                  :label="item" />
              </v-sheet>
            </v-menu>

            <template #append>
              <v-icon color="medium-emphasis" />
            </template>
          </v-btn>
        </div>

        <v-btn v-else append-icon="mdi-filter" class="text-none" slim text="Filters" variant="text"
          @click="drawer = !drawer">
          <template #append>
            <v-icon color="medium-emphasis" />
          </template>
        </v-btn>
      </div>

      <v-container fluid>
        <v-row>
          <v-col v-for="(item, i) in products" :key="i" cols="12" md="4" sm="6">
            <v-hover v-slot="{ isHovering, props }">
              <v-card class="mx-auto" v-bind="props" flat link :ripple="false" rounded="lg"
                :to="`/home/center/${item.id}`">
                <v-img block class="cursor-pointer" cover :aspect-ratio="16 / 9" :src="item.img" />
                <v-overlay class="align-center justify-center" contained :model-value="isHovering" scrim="surface" />
              </v-card>
            </v-hover>
            <div class="pa-3">
              <p class="text-body-1">{{ item.title }}</p>
              <p class="text-body-2 text-medium-emphasis mt-1">{{ item.subtitle }} | 北京易格通智仿真技术有限公司</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-navigation-drawer v-model="drawer" location="end" temporary>
      <v-toolbar class="pe-4" title="Filters">
        <template #append>
          <v-btn density="comfortable" icon="$close" size="small" @click="drawer = false" />
        </template>
      </v-toolbar>

      <v-expansion-panels bg-color="surface" flat multiple static tile variant="accordion">
        <v-expansion-panel>
          <template #title>
            <strong class="text-subtitle-1 font-weight-bold">By Category</strong>
          </template>

          <template #text>
            <v-checkbox-btn v-for="(item, i) in categories" :key="item" v-model="category[i]" color="primary"
              density="comfortable" :label="item" />
          </template>
        </v-expansion-panel>

        <v-expansion-panel>
          <template #title>
            <strong class="text-subtitle-1 font-weight-bold">By Color</strong>
          </template>

          <template #text>
            <v-checkbox-btn v-for="(item, i) in colors" :key="item" v-model="color[i]" color="primary"
              density="comfortable" :label="item" />
          </template>
        </v-expansion-panel>

        <v-expansion-panel>
          <template #title>
            <strong class="text-subtitle-1 font-weight-bold">By Size</strong>
          </template>

          <template #text>
            <v-checkbox-btn v-for="(item, i) in sizes" :key="item" v-model="size[i]" color="primary"
              density="comfortable" :label="item" />
          </template>
        </v-expansion-panel>

        <v-expansion-panel>
          <template #title>
            <strong class="text-subtitle-1 font-weight-bold">By Type</strong>
          </template>

          <template #text>
            <v-checkbox-btn v-for="(item, i) in types" :key="item" v-model="type[i]" color="primary"
              density="comfortable" :label="item" />
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>


  </v-layout>
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue'
import { useDisplay } from 'vuetify'

const category = ref([true, true])
const color = ref([])
const size = ref([])
const type = ref([])
const drawer = shallowRef(false)

const categories = ['Electronics', 'Books', 'Clothing', 'Home Decor']
const colors = ['White', 'Black', 'Red', 'Blue']
const types = ['Desk', 'Wall', 'Floor', 'Table']
const sizes = ['XS', 'S', 'M', 'L', 'XL']
const products = [
  {
    id: '1',
    title: '薄荷油微囊的制备',
    subtitle: '武毅君 | 河南大学',
    img: 'https://yigee-file.oss-cn-beijing.aliyuncs.com/image/cover/boheyou.jpg',
  },
  {
    id: '2',
    title: '农田土壤重金属污染生态修复虚拟仿真综合实验',
    subtitle: '刘佳',
    img: 'https://xnfz.tongji.edu.cn/oberyun-server/upload/smltplat/upload/image/20210507/92085_388x224_1603348103603.jpg',
  },
  {
    id: '3',
    title: '测量放射性物质辐射强度的居里虚拟仿真实验',
    subtitle: '羊亚平',
    img: 'https://xnfz.tongji.edu.cn/oberyun-server/upload/smltplat/upload/image/20210508/tjdx20201118135330_1605678871516y.png',
  },
  {
    id: '4',
    title: '岩石隧道防火体系',
    subtitle: '李晓军',
    img: 'https://xnfz.tongji.edu.cn/oberyun-server/upload/smltplat/upload/image/20221209083007/%E7%95%8C%E9%9D%A2.png',
  },
  {
    id: '5',
    title: '镜头语言虚拟实验',
    subtitle: '柳喆俊',
    img: 'https://xnfz.tongji.edu.cn/oberyun-server/upload/smltplat/upload/image/20210507/jingtouy.png',
  },
  {
    id: '6',
    title: '道路虚拟施工教学实验',
    subtitle: '杨轸',
    img: 'https://xnfz.tongji.edu.cn/oberyun-server/upload/smltplat/upload/image/20210508/20372_388x224.jpg',
  },
]

const display = useDisplay()

watch(display.mobile, val => {
  if (!val) drawer.value = false
})
</script>

<style lang="scss" scoped></style>
