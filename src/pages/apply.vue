<template>
  <div :class="{ 'apply-dark': settingsStore.isDark }">
    <div class="header">
      <div class="inner-header flex">
        <v-layout class="position-fixed top-0 w-100 h-100 "
          :class="{ 'bg-black': $vuetify.display.smAndDown && settingsStore.isDark, 'bg-white': $vuetify.display.smAndDown && !settingsStore.isDark }">
          <v-main min-height="800">
            <v-container class="h-100 pa-0" fluid>
              <v-row align="center" class="h-100" justify="center">
                <v-responsive class="flex-1-1 px-4" max-width="475">
                  <div class="text-h5 text-center mb-8 font-weight-medium">申请试用</div>

                  <v-card class="pa-10 mb-8" :elevation="$vuetify.display.smAndDown ? 0 : 3" rounded="lg">
                    <v-label class="text-subtitle-2">手机号码</v-label>

                    <v-text-field color="primary" density="compact" rounded="lg" variant="outlined"
                      v-model="state.phone" :counter="11" :error-messages="v$.phone.$errors.map(e => e.$message)"
                      required @blur="v$.phone.$touch" @input="v$.phone.$touch" />

                    <v-label class="text-subtitle-2">短信验证码</v-label>

                    <v-text-field color="primary" density="compact" rounded="lg" variant="outlined" v-model="state.code"
                      :counter="6" :error-messages="v$.code.$errors.map(e => e.$message)" required
                      @blur="v$.code.$touch" @input="v$.code.$touch">
                      <template #append-inner>
                        <v-btn variant="tonal" size="small" prepend-icon="mdi-send"
                          :disabled="state.phone.length < 11 || isWaiting" @click="sendSMS">
                          {{ isWaiting ? `请等待 ${clock} 秒` : '发送验证码' }} </v-btn>
                      </template>
                    </v-text-field>

                    <v-label class="text-subtitle-2">姓名</v-label>

                    <v-text-field color="primary" density="compact" rounded="lg" variant="outlined" v-model="state.name"
                      :counter="20" :error-messages="v$.name.$errors.map(e => e.$message)" required
                      @blur="v$.name.$touch" @input="v$.name.$touch" />

                    <v-label class="text-subtitle-2">学校/公司</v-label>

                    <v-text-field color="primary" density="compact" rounded="lg" variant="outlined" v-model="state.org"
                      :counter="50" :error-messages="v$.org.$errors.map(e => e.$message)" required @blur="v$.org.$touch"
                      @input="v$.org.$touch" />

                    <v-label class="text-subtitle-2">申请说明</v-label>

                    <v-textarea v-model="state.explain" :counter="200" color="primary" density="compact" rounded="lg"
                      variant="outlined"></v-textarea>

                    <v-btn block class="text-none" color="primary" flat rounded="lg" text="提交" @click="submit()" />
                  </v-card>

                  <div class="text-center text-body-2">
                    已有帐号。 <a class="text-decoration-none text-primary font-weight-medium cursor-pointer"
                      @click="router.replace('/login')">前往登录</a>
                  </div>
                </v-responsive>
              </v-row>
            </v-container>
          </v-main>
        </v-layout>
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

    <v-dialog v-model="dialogSucceed" contained max-width="400" persistent>
      <v-card rounded="lg">
        <template #text>
          <div class="text-center pt-4">
            <v-avatar class="mb-4" color="success" icon="mdi-check" size="x-large" variant="tonal" />

            <div class="font-weight-bold mb-2">
              申请已提交
            </div>

            <div class="text-body-2 text-medium-emphasis mb-6">
              请等待管理员通过审核。
            </div>

            <v-btn block class="text-none" color="primary" text="回到首页" variant="flat" to="/" />
          </div>
        </template>
      </v-card>
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
import { useCountdownTimer } from '@/utils/countdown-timer';
import { notify } from '@kyvg/vue3-notification';

const router = useRouter()
const settingsStore = useSettingsStore()
const dialog = ref(false)
const dialogSucceed = ref(false)

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

const { isWaiting, clock, start } = useCountdownTimer()

const sendSMS = async () => {
  start(60)
  const res = await MessageApi.sendCode(state.phone)
  if (res) {
    notify({
      title: "短信发送成功",
      type: "info",
    });
  } else {
    notify({
      title: "短信发送失败",
      type: "info",
      data: {
        icon: "mdi-alert-circle",
      },
    });
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
      if (res2 == 'true' || res2) {
        dialogSucceed.value = true
      }
    } catch (e) { /* empty */ }
    setTimeout(() => dialog.value = false, 400)
  } else {
    notify({
      title: "提交失败",
      type: "info",
      data: {
        icon: "mdi-alert-circle",
      },
    });
  }
}
</script>

<style scoped>
.apply-dark {
  background-color: #666666;
  height: 100%
}

.apply-dark .header {
  background: linear-gradient(60deg, rgb(36 25 78) 0%, rgb(0 66 74) 100%);
  color: white;
}

.apply-dark .waves {
  filter: invert(0.6)
}

.header {
  position: relative;
  background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%);
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
