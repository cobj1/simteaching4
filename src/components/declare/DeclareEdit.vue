<template>
  <v-container class="declare-documents">
    <v-row>
      <v-col cols="12">
        <v-hover v-if="editedItem.cover" v-slot="{ isHovering, props }">
          <v-card v-bind="props" color="surface-light" height="300px">
            <v-img :src="useFileUri(editedItem.cover)" height="300px"></v-img>
            <v-btn icon="mdi-close" class="opacity-0 position-absolute" :class="{ 'opacity-100': isHovering }"
              style="left: 50%; top: 50%; transform: translate(-50%,-50%);" :disabled="saving"
              @click="editedItem.cover = null; coverFile = null"></v-btn>
          </v-card>
        </v-hover>
        <v-file-upload v-else v-model="coverFile" :disabled="saving" density="comfortable" title="封面" height="300px"
          accept=".png,.jpg" @update:model-value="handleCoverFileUpdate"></v-file-upload>
      </v-col>
      <v-col cols="12" sm="12">
        <v-text-field v-model="editedItem.name" label="申报名称" :disabled="saving"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="editedItem.author" label="作者" :disabled="saving"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="editedItem.org" label="组织" :disabled="saving"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="editedItem.category" label="专业类型" :disabled="saving"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="editedItem.type" label="实验类型" :disabled="saving"></v-text-field>
      </v-col>
      <v-col cols="12" sm="8">
        <v-text-field v-model="editedItem.uri" label="实验链接(uri)" :disabled="saving"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn :prepend-icon="IconsAdapter('simulation')" size="x-large" width="100%" :disabled="saving">
          选择仿真实验
          <SelectionSimulation @confirm="handleSelectionSimulationConfirm"></SelectionSimulation>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="editedItem.intro" label="简介" :disabled="saving"></v-text-field>
      </v-col>
      <v-col cols="12">
        <DeclareVideo v-model:intro-video="editedItemDetails.introVideo" v-model:guide-video="editedItemDetails.guideVideo"
          v-model:intro-video-file="introVideoFile" v-model:guide-video-file="guideVideoFile" :disabled="saving">
        </DeclareVideo>
      </v-col>
      <v-col cols="12">
        <DeclareTeam v-model="editedItemDetails.team" :disabled="saving"></DeclareTeam>
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">设备要求</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            满足电脑设备要求，可以确保软件正常运行，获得最佳使用体验，提高工作效率，并避免不必要的经济损失。
          </p>
        </v-responsive>
        <ckeditor v-model="editedItemDetails.deviceCondition" :editor="editor" :config="editorConfig"
          :disabled="saving" />
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">教学目标</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            教学目标在科学教育中具有重要的地位和作用。它不仅可以帮助学生更好地理解和掌握科学知识，更重要的是可以培养学生的科学素养、实践能力、创新意识和探究精神，为他们未来的学习和发展打下坚实的基础。
          </p>
        </v-responsive>
        <ckeditor v-model="editedItemDetails.target" :editor="editor" :config="editorConfig" :disabled="saving" />
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">实验原理</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            实验原理的重要性体现在各个方面，它不仅是科学研究的重要手段，也是工程技术进步的重要推动力，同时对我们的日常生活也有着重要的意义。通过实验，我们可以更好地认识世界、改造世界，不断推动社会的发展和进步。
          </p>
        </v-responsive>
        <ckeditor v-model="editedItemDetails.principle" :editor="editor" :config="editorConfig" :disabled="saving" />
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">实验步骤</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            实验步骤是实验成功的关键。无论是科学研究还是学习，都应该重视实验步骤的制定和执行，以确保实验结果的准确性、可靠性和有效性，并培养科学思维和探究能力。
          </p>
        </v-responsive>
        <ckeditor v-model="editedItemDetails.steps" :editor="editor" :config="editorConfig" :disabled="saving" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Undo } from 'ckeditor5';
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { IconsAdapter } from '@/utils/icons-adapter';
import { reactive, ref } from 'vue';
import { ResourceSimulationApi } from '@/api/resource/resource-simulation';
import { useFileUri } from '@/utils/simulation-uri';

defineProps({
  saving: {
    type: Boolean,
    default: false
  }
})

const editor = ref(ClassicEditor)
const editorConfig = reactive({
  plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
  toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
})

const editedItem = defineModel('editedItem')
const editedItemDetails = defineModel('editedItemDetails')
const coverFile = defineModel('coverFile')
const introVideoFile = defineModel('introVideoFile')
const guideVideoFile = defineModel('guideVideoFile')

const handleSelectionSimulationConfirm = async (seleted) => {
  if (seleted.at(0)) {
    const res = await ResourceSimulationApi.info(seleted.at(0))
    editedItem.value.uri = useFileUri(res.url)
  }
}
const handleCoverFileUpdate = (file) => {
  editedItem.value.cover = useObjectUrl(file).value
}
</script>

<style lang="scss" scoped></style>
