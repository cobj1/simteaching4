<template>
  <div class="mr-2">
    <v-btn v-if="accountStore.token" class="ms-1" icon>
      <v-avatar image="@/assets/avatar/default-avatar.svg" />
      <v-menu activator="parent" width="280">
        <v-card variant="text" class=" rounded-lg	 border">
          <v-responsive class="bg-surface-light rounded-0" style="height: 88px;"></v-responsive>
          <div class="text-center mt-n9 mb-4">
            <v-avatar size="72" class="border-md border-opacity-100 border-surface-light bg-surface">
              <v-img src="@/assets/avatar/default-avatar.svg"></v-img>
            </v-avatar>
            <div class="text-h6 mt-2">{{ accountStore.info.name }}</div>
          </div>
          <VDivider></VDivider>
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home" link title="首页" @click="router.replace('/')" />
            <v-list-item prepend-icon="mdi-school" link title="控制台" to="/console/home" />
            <v-list-item prepend-icon="mdi-account-cog" link title="账号设置" @click="dialog = true" />
            <v-list-item prepend-icon="mdi-logout" link title="注销" @click="accountStore.logout" />
          </v-list>
        </v-card>
      </v-menu>
    </v-btn>
    <v-btn v-else class="text-none me-2" prepend-icon="mdi-login" @click="goLogin">
      <span style="font-size: 14px">登录</span>
    </v-btn>
    <UserSettings v-model="dialog"></UserSettings>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const accountStore = useAccountStore();
const route = useRoute()
const router = useRouter();

const dialog = ref(false);

const goLogin = () => {
  router.push('/login?redirect=' + route.fullPath)
}

onMounted(() => {
  if (accountStore.token) {
    accountStore.validateValid()
  }
})
</script>

<style scoped></style>
