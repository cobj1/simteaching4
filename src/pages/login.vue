<template>
  <div class="bg">
    <div class="login-box">
      <h2>校级平台</h2>
      <form>
        <div class="user-box">
          <input type="text" name="" required="" v-model="account" @keyup.enter="login">
          <label>用户名</label>
        </div>
        <div class="user-box">
          <input type="password" name="" required="" v-model="password" autocomplete="off"
            @focus="$event.target.type = 'password'" @keyup.enter="login">
          <label>密码</label>
        </div>
        <v-checkbox v-model="remember" style=" display: flex; text-align: left; color: #b5b5b5;"
          label="记住密码"></v-checkbox>

        <a href="#" @click="login">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          登录
        </a>
        <div style="position: relative;">
          <div class="apply" @click="router.replace('/apply')">
            <v-icon icon="mdi-card-account-details-outline" size="large" style="margin-right: 10px;"></v-icon>
            申请试用
          </div>
        </div>
      </form>
    </div>
    <v-snackbar v-model="snackbar" multi-line :timeout="2000" color="yellow-darken-1">
      {{ text }}

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/account';

const accountStore = useAccountStore()
const router = useRouter()
const route = useRoute()
const remember = ref(false)
const redirect = ref(route.query.redirect)
const account = ref('')
const password = ref('')
const snackbar = ref(false)
const text = ref('')

const login = async () => {
  if (account.value && password.value) {
    const res = await accountStore.login(account.value, password.value)
    if (res.code == '0') {
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
    } else {
      text.value = res.message
      snackbar.value = true
    }

  } else {
    text.value = `账号和密码不得为空`
    snackbar.value = true
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

<style lang="scss" scoped>
.page-header {
  background: rgba(44, 44, 44, 0.2);
  height: 100vh;
  max-height: 1050px;

  .page-header-image {
    background-image: url('../assets/page_login/bg.jpg');
    position: absolute;
    background-size: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .container {
    max-width: 960px;
    margin-right: auto;
    margin-left: auto;
    padding-right: 15px;
    padding-left: 15px;
    width: 100%;
    height: 100%;
    z-index: 2;
    text-align: center;
    position: relative;

    .content-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 0 15px;
      color: #FFFFFF;
      width: 100%;
      max-width: 880px;
    }

    .card {
      border: 0;
      display: inline-block;
      position: relative;
      overflow: hidden;
      width: 100%;
      margin-bottom: 20px;
      background: transparent;
      box-shadow: none;
      border-radius: 0.25rem;
      padding-bottom: 0.7rem;
      max-width: 320px;
    }

    .logo-container {
      width: 85px;
      margin: 0 auto;
      margin-bottom: 40px;

      img {
        width: 100%;
      }
    }

    .form {
      .input-group {
        position: relative;
        display: flex;
        width: 100%;
        margin-bottom: 10px;
        border-radius: 30px;
        transition: all .3s;

        &:focus-within {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .input-group-addon {
          margin-bottom: 0;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.25;
          text-align: center;
          transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
          border-radius: 30px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          padding: 15px 0 15px 19px;
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.8);
        }

        .form-control {
          flex: 1 1 auto;
          background-color: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-size: 12px;
          padding: 15px 18px 15px 16px;
          border-left: 0 none;
          border: medium none;
          border-radius: 30px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          font-family: "Montserrat", "Helvetica Neue", Arial, sans-serif;
        }

        .form-control::-webkit-input-placeholder {
          color: #C0C0C0;
        }

        .form-control:-moz-placeholder {
          color: #C0C0C0;
        }

        .form-control::-moz-placeholder {
          color: #C0C0C0;
        }

        .form-control:-ms-input-placeholder {
          color: #C0C0C0;
        }
      }

      .footer.text-center {
        text-align: center;

        .btn {
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          user-select: none;
          transition: all .15s ease-in-out;
          display: block;
          font-weight: 400;
          line-height: 1.35em;
          margin: 5px 1px;
          border: none;
          cursor: pointer;
          background-color: #6697fb;
          color: #FFFFFF;
          border-width: 1px;
          border-radius: 30px;
          font-size: 1em;
          padding: 12px 48px;
          text-decoration: none;

          &:hover {
            background-color: #76a7ff;
            box-sizing: 0 0 10px #333;
          }
        }
      }
    }
  }

  &::before {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: block;
    left: 0;
    top: 0;
    content: "";
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
<style scoped>
.bg {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  text-align: center;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: .4s;
}

.login-box .user-box input:focus~label,
.login-box .user-box input:valid~label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  margin-top: 40px;
  letter-spacing: 4px
}

.login-box a:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4,
    0 0 25px #03e9f4,
    0 0 50px #03e9f4,
    0 0 100px #03e9f4;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}

.apply {
  position: absolute;
  right: 0;
  font-size: 13px;
  color: #778;
  cursor: pointer;
  transition: color .2s;
  display: flex;
  align-items: center;
}

.apply:hover {
  color: #99a;
}

.apply .el-icon {
  margin-right: 5px;
}
</style>
