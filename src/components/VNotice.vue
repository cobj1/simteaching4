<template>
  <div>
    <v-dialog v-model="dialogAnnouncement" contained max-width="500">
      <v-card rounded="lg">
        <template #text>
          <div class="text-center pt-4">
            <div class="text-h4 font-weight-bold mb-2">
              {{ announcement.title }}
            </div>

            <div class="text-body-2 text-medium-emphasis mb-10">
              {{ announcement.content }}
            </div>

            <v-btn block class="text-none" color="primary" size="large" text="继续访问" variant="flat"
              @click="dialogAnnouncement = false" />
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { NoticeApi } from '@/api/notice';
import { onMounted, ref, shallowRef } from 'vue'
import { notify } from "@kyvg/vue3-notification";
import { useAccountStore } from '@/stores/account';

const accountStore = useAccountStore()
const dialogAnnouncement = shallowRef(false)
const announcement = ref({ title: '', content: '' })

const loadItems = async () => {
  try {
    const items = await NoticeApi.launch('公告')
    const item = items.find(item => item.type == '公告')
    announcement.value.title = item.title
    announcement.value.content = item.content
    dialogAnnouncement.value = true
  } catch (e) { /* empty */ }
  try {
    const items = await NoticeApi.launch('通知')
    items.filter(item => item.type == '通知')
      .forEach(item => {
        notify({
          id: item.id,
          title: item.title,
          text: item.content,
          type: "info",
          data: {
            icon: "mdi-bell-badge",
          },
        });
      });
  } catch (e) { /* empty */ }
}
onMounted(() => {
  if (accountStore.token)
    loadItems()
})

</script>

<style lang="scss" scoped></style>
