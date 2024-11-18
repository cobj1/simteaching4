<template>
  <v-btn v-if="accountStore.token" class="ms-1" icon>
    <v-avatar image="@/assets/avatar/default-avatar.svg" />
    <v-menu activator="parent">
      <v-list density="compact" nav>
        <v-list-item append-icon="mdi-cog-outline" link title="设置" />
        <v-list-item append-icon="mdi-logout" link title="注销" @click="accountStore.logout" />
      </v-list>
    </v-menu>
  </v-btn>
  <v-btn v-else class="text-none me-2" prepend-icon="mdi-login" @click="router.push('/login')">
    <span style="font-size: 14px;">登录</span>
  </v-btn>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/account';
import { useRouter } from 'vue-router';

const accountStore = useAccountStore()
const router = useRouter()

</script>

<style scoped></style>
