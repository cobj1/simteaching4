<template>
  <v-container class="declare-documents">
    <v-row>
      <v-col cols="12">
        <v-card color="surface-light" height="300px">
          <v-img :src="useFileUri(editedItem.cover)" height="300px"></v-img>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12">
        <section>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            申报名称
          </h3>
          <div class="text-body-2 text-medium-emphasis mb-4 w-100 ">
            {{ editedItem.name }}
          </div>
          <v-divider />
        </section>
      </v-col>
      <v-col cols="12" sm="6">
        <section>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            作者
          </h3>
          <div class="text-body-2 text-medium-emphasis mb-4 w-100 ">
            {{ editedItem.author }}
          </div>
          <v-divider />
        </section>
      </v-col>
      <v-col cols="12" sm="6">
        <section>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            组织
          </h3>
          <div class="text-body-2 text-medium-emphasis mb-4 w-100 ">
            {{ editedItem.org }}
          </div>
          <v-divider />
        </section>
      </v-col>
      <v-col cols="12" sm="6">
        <section>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            专业类型
          </h3>
          <div class="text-body-2 text-medium-emphasis mb-4 w-100 ">
            {{ editedItem.category }}
          </div>
          <v-divider />
        </section>
      </v-col>
      <v-col cols="12" sm="6">
        <section>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            实验类型
          </h3>
          <div class="text-body-2 text-medium-emphasis mb-4 w-100 ">
            {{ editedItem.type }}
          </div>
          <v-divider />
        </section>
      </v-col>
      <v-col cols="12">
        <section>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            实验链接(uri)
          </h3>
          <div class="text-body-2 text-medium-emphasis mb-4 w-100 ">
            {{ editedItem.uri }}
          </div>
          <v-divider />
        </section>
      </v-col>
      <v-col cols="12">
        <section>
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            简介
          </h3>
          <div class="text-body-2 text-medium-emphasis mb-4 w-100 ">
            {{ editedItem.intro }}
          </div>
          <v-divider />
        </section>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn :disabled="!editedItemDetails.introVideo" prepend-icon="mdi-play-circle-outline" size="x-large"
          width="100%" class="mb-2" @click="playVideo(null, useFileUri(editedItemDetails.introVideo))">
          简介视频
          <span v-show="!!editedItemDetails.introVideo">(已上传)</span>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn :disabled="!editedItemDetails.guideVideo" prepend-icon="mdi-play-circle-outline" size="x-large"
          width="100%" class="mb-2" @click="playVideo(null, useFileUri(editedItemDetails.guideVideo))">
          引导视频
          <span v-show="!!editedItemDetails.guideVideo">(已上传)</span>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <DeclareTeam v-model="editedItemDetails.team" read-only></DeclareTeam>
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">设备要求</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            满足电脑设备要求，可以确保软件正常运行，获得最佳使用体验，提高工作效率，并避免不必要的经济损失。
          </p>
        </v-responsive>
        <div v-html="editedItemDetails.deviceCondition"></div>
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">教学目标</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            教学目标在科学教育中具有重要的地位和作用。它不仅可以帮助学生更好地理解和掌握科学知识，更重要的是可以培养学生的科学素养、实践能力、创新意识和探究精神，为他们未来的学习和发展打下坚实的基础。
          </p>
        </v-responsive>
        <div v-html="editedItemDetails.target"></div>
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">实验原理</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            实验原理的重要性体现在各个方面，它不仅是科学研究的重要手段，也是工程技术进步的重要推动力，同时对我们的日常生活也有着重要的意义。通过实验，我们可以更好地认识世界、改造世界，不断推动社会的发展和进步。
          </p>
        </v-responsive>
        <div v-html="editedItemDetails.principle"></div>
      </v-col>
      <v-col cols="12">
        <v-responsive class="text-center mx-auto my-10" max-width="700">
          <p class="font-weight-bold text-h4 mb-2">实验步骤</p>
          <p class="text-subtitle-1 text-medium-emphasis">
            实验步骤是实验成功的关键。无论是科学研究还是学习，都应该重视实验步骤的制定和执行，以确保实验结果的准确性、可靠性和有效性，并培养科学思维和探究能力。
          </p>
        </v-responsive>
        <div v-html="editedItemDetails.steps"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useFileUri } from '@/utils/simulation-uri';
import GLightbox from 'glightbox'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const editedItem = defineModel('editedItem')
const editedItemDetails = defineModel('editedItemDetails')

const playVideo = (file, uri) => {
  GLightbox({
    elements: [{ 'href': uri || useObjectUrl(file).value, 'type': 'video' }],
    autoplayVideos: true,
  }).open();
}
</script>

<style lang="scss" scoped></style>
