<template>
  <v-dialog v-model="dialog" activator="parent" max-width="1200" scrollable>
    <template v-slot:default>
      <v-card prepend-icon="mdi-earth" title="批量导入试题">
        <template #append>
          <v-btn prepend-icon="mdi-download" @click="download">下载模板</v-btn>
        </template>
        <v-divider></v-divider>

        <v-file-upload v-model="file" title="上传文件" divider-text="或" browse-text="浏览文件" accept=".xlsx"
          :density="file ? 'compact' : 'default'" @update:model-value="handleFileUpdate"></v-file-upload>

        <v-card-text v-if="file" class="px-4 d-flex">
          <v-data-table-virtual v-model="selected" :headers="headers" :items="items" fixed-header item-value="index"
            show-select height="100%" :loading="saving">
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.status="{ item }">
              <div v-show="item.status == 0"> - </div>
              <div v-show="item.status == 1"> 等待 </div>
              <div v-show="item.status == 2" class="text-red"> 失败
                <v-tooltip v-if="item.message" :text="item.message">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-help-circle-outline" size="20px" class="ml-2"></v-icon>
                  </template>
                </v-tooltip>
              </div>
              <div v-show="item.status == 3" class="text-teal"> 成功 </div>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.category="{ item }">
              {{ categoryName(item.category) || '<未分类>' }}
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.options="{ item }">
              <div v-if="item.options">
                <v-chip v-for="option in item.options" :key="option" class="mx-1"> {{ option }} </v-chip>
              </div>
            </template>
            <!-- eslint-disable-next-line vue/valid-v-slot -->
            <template v-slot:item.answer="{ item }">
              <div v-if="item.answer">
                <v-chip v-for="a in item.answer" :key="a" class="mx-1"> {{ a + 1 }} </v-chip>
              </div>
            </template>

          </v-data-table-virtual>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>

          <v-btn :disabled="selected.length == 0">
            批量设置类型
            <v-dialog activator="parent" max-width="340">
              <template v-slot:default="{ isActive }">
                <v-card prepend-icon="mdi-picture-in-picture-bottom-right" title="批量设置类型">
                  <template #default>
                    <div>
                      <v-select v-model="category" class="pa-2" label="选择类型" :items="resourceStore.categorys"
                        item-title="name" item-value="id" clearable></v-select>
                    </div>
                  </template>
                  <template v-slot:actions>
                    <v-spacer></v-spacer>
                    <v-btn class="ml-auto" text="关闭" @click="isActive.value = false"></v-btn>
                    <v-btn class="ml-auto" text="保存" color="surface-variant" variant="flat" :disabled="!category"
                      @click="changeCategoryItems(isActive)"></v-btn>
                  </template>
                </v-card>
              </template>
            </v-dialog>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn text="取消" @click="close()"></v-btn>

          <v-btn color="surface-variant" text="导入" variant="flat" :disabled="selected.length == 0" :loading="saving"
            @click="save()"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { read, utils } from "xlsx";
import FileSaver from 'file-saver';
import { nextTick, onMounted, ref } from 'vue';
import { useResourceStore } from '@/stores/resource';
import { useQuestionsStore } from '@/stores/questions';
import { ResourceQuestionsApi } from '@/api/resource/resource-questions';

const emit = defineEmits(['change'])
const resourceStore = useResourceStore()
const questionsStore = useQuestionsStore()

const dialog = ref(false)
const file = ref()

const headers = ref([
  { title: '题目', align: 'start', key: 'name' },
  { title: '题型', align: 'start', key: 'type' },
  { title: '难易度', align: 'start', key: 'difficulty' },
  { title: '类型', align: 'start', key: 'category' },
  { title: '选项', align: 'start', key: 'options' },
  { title: '答案', align: 'start', key: 'answer' },
  { title: '答案解析', align: 'start', key: 'answerAnalysis' },
  { title: '状态', align: 'end', key: 'status' },
])
const items = ref([])
const selected = ref([])
const category = ref()

const saving = ref(false)

const handleFileUpdate = async (file) => {
  items.value = []
  selected.value = []

  if (file) {
    const buf = await file.arrayBuffer()
    const workbook = read(buf);
    const worksheet = workbook.Sheets.Sheet1

    var data = utils.sheet_to_json(worksheet);

    data.forEach((item, index) => {
      const type = questionsStore.types.find(type => type == item['题型'])
      const difficulty = questionsStore.difficultys.find(difficulty => difficulty == item['难易度']) || '普通'
      const category = resourceStore.categorys.find(category => category.name == item['类型'])
      const options = item['选项'] ? item['选项'].split('丨') : null
      const answer = item['答案'] ? item['答案'].toString().split(',').map(a => a - 1) : null
      const name = item['题目']

      if (name && type && difficulty) {
        items.value.push({
          index,
          name,
          type,
          difficulty,
          category: category ? category.id : null,
          options,
          answer,
          answerAnalysis: item['答案解析'],
          status: 0,
          message: null
        })
        selected.value.push(index)
      }
    })
  }
}

const categoryName = (id) => resourceStore.categorys.find(category => category.id == id)?.name

const changeCategoryItems = (isActive) => {
  items.value
    .filter(item => selected.value.includes(item.index))
    .forEach(item => {
      item.category = category.value
    })

  isActive.value = false
}

const download = () => {
  FileSaver.saveAs('/file/template-questions.xlsx', 'template-questions.xlsx')
}

const close = () => {
  dialog.value = false

  nextTick(() => {
    file.value = null
    items.value = []
  })
}

const save = async () => {
  saving.value = true
  const questions = selected.value.map(index => {
    const item = { ...items.value[index] }
    if (item.answer instanceof Array) item.answer = item.answer.join(',')
    return item
  })
  const results = await ResourceQuestionsApi.batch(questions)
  if (results) {
    results.forEach(result => {
      items.value[result.index].status = result.status
      items.value[result.index].message = result.message
    })
  }
  setTimeout(() => saving.value = false, 200)
  emit('change')
}

onMounted(() => {
  resourceStore.loadCategorys()
})
</script>

<style lang="scss" scoped></style>
