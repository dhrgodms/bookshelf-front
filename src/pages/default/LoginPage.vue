<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 420px">
      <q-card-section class="q-mb-md text-h6 text-center"> 로그인 </q-card-section>

      <div v-if="!loggedInState.isLoggedIn" class="q-pa-md" style="max-width: 400px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            label="Email *"
            hint="이메일을 입력하세요."
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please type your Email']"
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
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authApi from '../../boot/auth'
import { useLoggedIn } from 'src/stores/loggedIn'
import { useUserInfo } from 'src/stores/userInfo'

const $q = useQuasar()
const router = useRouter()
const loggedInState = useLoggedIn()
const userInfoState = useUserInfo()

const email = ref('123@g.com')
const password = ref('123')
const result = ref(null)

async function handleForm() {
  try {
    const response = await authApi.login(email.value, password.value)

    result.value = response.data

    const accessToken = response.data?.token
    const refreshToken = response.data?.refresh

    if (accessToken) {
      localStorage.setItem('access', accessToken)
    }
    if (refreshToken) {
      localStorage.setItem('refresh', refreshToken)
    }

    console.log('Login success!!')
  } catch (err) {
    console.error('Login Failed:', err)
    throw err // 반드시 rethrow해서 onSubmit에서 catch됨
  }
}

async function onSubmit() {
  try {
    await handleForm()
    userInfoState.setUsername(result.value)
    loggedInState.login()
    $q.notify({
      color: 'green-9',
      textColor: 'white',
      icon: 'cloud_done',
      message: `${result.value?.username}님, 환영합니다.`,
    })

    const redirectPath = localStorage.getItem('redirectAfterLogin')

    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin')
      router.push(redirectPath)
    } else {
      router.push('/')
    }
  } catch {
    console.log(result.value)
    $q.notify({
      color: 'red-9',
      textColor: 'white',
      icon: 'warning',
      message: '아이디와 비밀번호가 일치하지 않습니다.',
    })
  }
}

function onReset() {
  email.value = null
  password.value = null
}
</script>
