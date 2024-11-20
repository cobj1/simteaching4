<template>
  <div :class="{ 'apply-dark': settingsStore.isDark }">
    <div class="header">
      <div class="inner-header flex">
        <v-sheet class="pa-8 position-absolute elevation-4	" style="z-index: 10; "
          :style="{ 'height': $vuetify.display.smAndDown ? '100vh' : 'auto', 'top': $vuetify.display.smAndDown ? '0' : 'calc(50vh - 400px)', 'width': $vuetify.display.smAndDown ? '100%' : '600px' }">
          <p class="mt-2 text-h7 font-weight-bold text-md-h6 pb-5">
            申请试用
          </p>
          <v-alert class="my-3 py-3" border="end" type="warning" variant="outlined" elevation="2">
            学生请勿在此注册，请联系组织者获取登录账号。
          </v-alert>
          <form>
            <v-text-field v-model="state.phone" :counter="11" :error-messages="v$.phone.$errors.map(e => e.$message)"
              label="请输入手机号码" required @blur="v$.phone.$touch" @input="v$.phone.$touch"></v-text-field>
            <v-text-field v-model="state.code" :counter="6" :error-messages="v$.code.$errors.map(e => e.$message)"
              label="请输入短信验证码" required @blur="v$.code.$touch" @input="v$.code.$touch">
              <template #append-inner>
                <v-btn prepend-icon="mdi-send" :disabled="state.phone.length < 11" @click="sendSMS">发送验证码</v-btn>
              </template>
            </v-text-field>
            <v-text-field v-model="state.name" :counter="20" :error-messages="v$.name.$errors.map(e => e.$message)"
              label="请输入姓名" required @blur="v$.name.$touch" @input="v$.name.$touch"></v-text-field>
            <v-text-field v-model="state.org" :counter="50" :error-messages="v$.org.$errors.map(e => e.$message)"
              label="请输入学校/公司名称" required @blur="v$.org.$touch" @input="v$.org.$touch"></v-text-field>
            <v-textarea v-model="state.explain" label="申请说明" :counter="200"></v-textarea>
            <v-btn class="mt-2 me-4" @click="submit()">
              提交
            </v-btn>
            <v-btn class="mt-2" @click="clear">
              清除
            </v-btn>
          </form>
          <v-btn class="border-b-sm mt-2" variant="text" size="small"
            @click="router.replace('/login')">已有帐号，直接登录</v-btn>
        </v-sheet>
      </div>
      <div>
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g class="parallax">
            <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
            <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>
    <v-snackbar v-model="successSnackbar" multi-line :timeout="2000" color="green-darken-4">
      {{ text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="successSnackbar = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="warningSnackbar" multi-line :timeout="2000" color="yellow-darken-1">
      {{ text }}

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="warningSnackbar = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="dialog" max-width="320" persistent>
      <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item prepend-icon="$vuetify-outline" title="提交申请试用表单...">
          <template v-slot:prepend>
            <div class="pe-4">
              <ProductLogo width="26px"></ProductLogo>
            </div>
          </template>

          <template v-slot:append>
            <v-progress-circular color="primary" indeterminate="disable-shrink" size="16"
              width="2"></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import ProductLogo from '@/components/ProductLogo.vue';
import { MessageApi } from '@/api/message';
import { ApplayApi } from '@/api/apply';

const router = useRouter()
const settingsStore = useSettingsStore()
const successSnackbar = ref(false)
const warningSnackbar = ref(false)
const text = ref('')
const dialog = ref(false)

const initialState = {
  phone: '',
  code: '',
  name: '',
  org: '',
  explain: ''
}

const state = reactive({
  ...initialState,
})

const rules = {
  phone: { required },
  code: { required },
  name: { required },
  org: { required },
}

const v$ = useVuelidate(rules, state)

function clear() {
  v$.value.$reset()

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value
  }
}

const sendSMS = async () => {
  const res = await MessageApi.sendCode(state.phone)
  if (res) {
    text.value = '短信发送成功'
    successSnackbar.value = true
  } else {
    text.value = '短信发送失败'
    warningSnackbar.value = true
  }
}

const submit = async () => {
  const res = await v$.value.$validate()
  if (res) {
    dialog.value = true
    try {
      const res2 = await ApplayApi.giveATrial({
        phone: state.phone,
        code: state.code,
        name: state.name,
        org: state.org,
        illustrate: state.explain
      })
      if (res2.code == 0) {
        text.value = '申请提交成功'
        successSnackbar.value = trued
      } else {
        text.value = res2.message
        warningSnackbar.value = true
      }
    } catch (e) { /* empty */ }
    setTimeout(() => dialog.value = false, 400)
  } else {
    text.value = '提交失败'
    warningSnackbar.value = true
  }
  console.log(res)
}
</script>

<style scoped>
.apply-dark {
  background-color: #666666;
  height: 100%
}

.apply-dark .header {
  background: linear-gradient(60deg, rgb(36 25 78) 0%, rgb(0 66 74) 100%);
}

.apply-dark .waves {
  filter: invert(0.6)
}

.header {
  position: relative;
  text-align: center;
  background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%);
  color: white;
}

.logo {
  width: 50px;
  fill: white;
  padding-right: 15px;
  display: inline-block;
  vertical-align: middle;
}

.inner-header {
  height: 65vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.flex {
  /*Flexbox for containers*/
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px;
  /*Fix for safari gap*/
  min-height: 100px;
  max-height: 150px;
}

.content {
  position: relative;
  height: 20vh;
  text-align: center;
  background-color: white;
}

/* Animation */

.parallax>use {
  animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}

.parallax>use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax>use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax>use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax>use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }

  .content {
    height: 30vh;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
