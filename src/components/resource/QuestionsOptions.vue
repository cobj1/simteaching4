<template>
  <VSheet>
    <v-radio-group v-model="answer" v-if="type == '单选题'" hide-details>
      <v-radio v-for="(item, index) in options" :data-label="item" :key="index" :value="'' + index"
        :disabled="disabled">
        <template #label>
          <v-text-field v-model="options[index]" variant="underlined" color="black" v-if="editor">
            <template #append>
              <v-btn icon="mdi-close" density="comfortable" :disabled="options.length <= 1" @click="del(index)"></v-btn>
            </template>
          </v-text-field>
          <div v-else class="pa-4">
            {{ options[index] }}
          </div>
        </template>
      </v-radio>
    </v-radio-group>
    <div v-if="type == '多选题'">
      <v-checkbox v-model="answer" v-for="(item, index) in options" :data-label="item" :key="index" :value="'' + index"
        hide-details :disabled="disabled">
        <template #label>
          <v-text-field v-model="options[index]" variant="underlined" v-if="editor">
            <template #append>
              <v-btn icon="mdi-close" density="comfortable" :disabled="options.length <= 1" @click="del(index)"></v-btn>
            </template>
          </v-text-field>
          <div v-else class="pa-4">
            {{ options[index] }}
          </div>
        </template>
      </v-checkbox>
    </div>
    <div v-if="type == '简答题'">
      <v-text-field v-model="answer" label="简短回答问题" :disabled="disabled"></v-text-field>
    </div>
    <VBtn prepend-icon="mdi-plus" v-if="editor && (type == '单选题' || type == '多选题')" v-show="editor" @click="add">
      添加选项
    </VBtn>
  </VSheet>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const answer = defineModel('answer') as any
const options = defineModel('options') as any
const props = defineProps({
  type: {
    type: String,
    default: '单选题'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  editor: {
    type: Boolean,
    default: false
  }
})

const defaultOptions = ref(['选项 1'])

watch(() => props.type, () => init())

const add = () => {
  options.value.push(`选项 ${options.value.length + 1}`)
}

const del = (index: number) => {
  options.value.splice(index, 1)
}

const init = () => {
  answer.value = null
  if (props.type == '单选题') {
    answer.value = 0
    options.value = [...defaultOptions.value]
  }
  if (props.type == '多选题') {
    answer.value = []
    options.value = [...defaultOptions.value]
  }
  if (props.type == '简答题') {
    answer.value = null
    options.value = []
  }
}

onMounted(() => {
  if (props.type == '单选题' || props.type == '多选题') {
    if (options.value.length == 0) init()
  }
})
</script>

<style scoped>
.v-radio:deep(.v-label),
.v-checkbox:deep(.v-label) {
  width: 100%;
}
</style>
<style>
input:disabled {
  border-color: black !important;
}
</style>
