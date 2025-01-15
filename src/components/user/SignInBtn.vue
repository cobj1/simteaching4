<template>
  <v-btn prepend-icon="mdi-calendar-check-outline" variant="outlined" :disabled="disabled" class="mx-4"
    @click="onSignIn">
    {{ disabled ? '已签到' : '签到' }}
  </v-btn>
</template>

<script setup>
import { SignInApi } from '@/api/user/sign-in';
import { onMounted, ref } from 'vue';

const disabled = ref(false)

const onSignIn = async () => {
  await SignInApi.signIn()
  load()
}

const load = async () => {
  disabled.value = await SignInApi.log()
}

onMounted(load)
</script>

<style lang="scss" scoped></style>
