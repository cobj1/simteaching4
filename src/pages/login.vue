<template>
  <v-layout>
    <v-main min-height="800">
      <v-container class="h-100 pa-0" fluid>
        <v-row align="center" class="h-100" justify="center">
          <v-responsive class="flex-1-1 px-4" max-width="475">
            <v-img class="mx-auto mb-4" max-width="60" src="/favicon.ico" />

            <div class="text-h5 text-center mb-8 font-weight-medium">登录账户</div>

            <v-card class="pa-10 mb-8" :elevation="$vuetify.display.smAndDown ? 0 : 3" rounded="lg" variant="text">
              <v-label class="text-subtitle-2">账号</v-label>

              <v-text-field color="primary" density="compact" rounded="lg" variant="outlined" v-model="account"
                autofocus @keyup.enter="login()" />

              <v-label class="text-subtitle-2">密码</v-label>

              <v-text-field color="primary" density="compact" rounded="lg" variant="outlined" v-model="password"
                type="password" @keyup.enter="login()" />

              <div class="mb-4">
                <div class="d-flex justify-space-between align-center">
                  <v-checkbox-btn v-model="remember" class="ms-n3" color="primary" label="Remember me">
                    <template #label>
                      <span class="text-body-2">记住账号</span>
                    </template>
                  </v-checkbox-btn>

                  <a class="text-decoration-none text-primary text-body-2 font-weight-medium" href="#">
                    忘记密码?
                  </a>
                </div>
              </div>
              <v-btn block class="text-none" color="primary" flat rounded="lg" text="登录" @click="login()" />
              <v-btn block class="text-none mt-4" flat rounded="lg" text="游客登录" @click="login(true)" />
            </v-card>
            <div class="text-center text-body-2">
              没有账户? <a class="text-decoration-none text-primary font-weight-medium cursor-pointer"
                @click="router.replace('/apply')">申请试用</a>
            </div>
          </v-responsive>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { useAccountStore } from '@/stores/account';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import { notify } from '@kyvg/vue3-notification';

const route = useRoute()
const router = useRouter()
const accountStore = useAccountStore()
const account = ref('')
const password = ref('')
const remember = ref(false)
const redirect = ref(route.query.redirect)

const login = async (guest = false) => {
  if (guest || account.value && password.value) {
    const res = await accountStore.login(account.value, password.value, guest)

    if (res) {
      if (remember.value) {
        localStorage.setItem('a', AES.encrypt(account.value, 'simteaching').toString())
        localStorage.setItem('p', AES.encrypt(password.value, 'simteaching').toString())
        localStorage.setItem('remember', remember.value)
      } else {
        localStorage.removeItem('a')
        localStorage.removeItem('p')
        localStorage.removeItem('remember')
      }
      router.push(redirect.value || '/')
    }
  } else {
    notify({
      title: "账号和密码不得为空",
      type: "info",
      data: {
        icon: "mdi-alert-circle",
      },
    });
  }
}

onMounted(() => {
  const accountArchive = localStorage.getItem("a")
  const passwordArchive = localStorage.getItem("p")
  const rememberArchive = localStorage.getItem("remember")
  if (rememberArchive && rememberArchive == 'true') {
    try {
      account.value = AES.decrypt(accountArchive, 'simteaching').toString(CryptoJS.enc.Utf8)
      password.value = AES.decrypt(passwordArchive, 'simteaching').toString(CryptoJS.enc.Utf8)
      remember.value = true
    } catch (e) { /* empty */ }
  }
})


</script>

<style lang="scss" scoped></style>
