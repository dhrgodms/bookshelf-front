<template>
  <q-page class="flex column" style="align-items: center">
    <div v-if="!loggedInState.isLoggedIn" class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          v-model="loginId"
          label="Id *"
          hint="아이디를 입력하세요."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type your id']"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Password *"
          hint="비밀번호를 입력하세요."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type your password']"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
        <div class="text-subtitle2">
          아직 회원이 아니신가요?
          <q-btn label="Join" to="/join" color="primary" class="q-ml-sm" />
        </div>
      </q-form>
    </div>
    <div v-if="loggedInState.isLoggedIn">이미 로그인한 계정입니다.</div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authApi from '../boot/auth'
import { useLoggedIn } from 'src/stores/loggedIn'
import { useUserInfo } from 'src/stores/userInfo'

const $q = useQuasar()
const router = useRouter()
const params = new URLSearchParams()
const loggedInState = useLoggedIn()
const userInfoState = useUserInfo()

const loginId = ref('123')
const password = ref('123')
const result = ref(null)

async function handleForm() {
  authApi
    .login(loginId.value, password.value)
    .then((response) => {
      result.value = response.data
      console.log(response.headers)
      const accessToken = response.headers['access']
      const refreshToken = response.headers['refresh']

      if (accessToken) {
        localStorage.setItem('access', accessToken)
      }
      if (refreshToken) {
        localStorage.setItem('refresh', refreshToken)
      }
      console.log(accessToken)

      console.log('Login success!!')
    })
    .catch((err) => {
      console.error('Login Failed:', err)
    })
}

async function onSubmit() {
  await handleForm()
  if (result.value == 'loginError') {
    console.log(result.value)
    $q.notify({
      color: 'red-9',
      textColor: 'white',
      icon: 'warning',
      message: '아이디와 비밀번호가 일치하지 않습니다.',
    })
  } else {
    userInfoState.setUsername(result.value)
    loggedInState.login()
    $q.notify({
      color: 'green-9',
      textColor: 'white',
      icon: 'cloud_done',
      message: `${result.value}님, 환영합니다.`, // [ ] 백엔드 단에서 멤버 정보 간단하게 보내기
    })

    const redirectPath = localStorage.getItem('redirectAfterLogin')

    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirectPath)
    } else {
      router.push('/')
    }
  }
}

function onReset() {
  loginId.value = null
  password.value = null

  onResetParam()
}

function onResetParam() {
  params.delete('loginId')
  params.delete('password')
}
</script>
