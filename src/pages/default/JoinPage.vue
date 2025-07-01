<template>
  <q-page class="flex column" style="align-items: center">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmitJoin" @reset="onResetJoin" class="q-gutter-md">
        <div class="row" style="align-items: center; justify-content: space-between; gap: 0.6em">
          <q-input
            filled
            v-model="loginId"
            label="Id *"
            :hint="
              idCheck
                ? '사용 가능한 아이디 입니다.'
                : idCheck == false
                  ? '중복된 아이디 입니다.'
                  : '아이디를 입력해주세요.'
            "
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please type your id']"
            :disable="idCheck"
            outlined
            :color="idCheck ? 'green' : 'red'"
          />
          <q-btn
            label="중복확인"
            color="primary"
            style="height: fit-content; width: fit-content; font-size: 0.8em"
            padding="xs"
            @click="onCheckId"
          />
        </div>
        <q-input
          filled
          v-model="name"
          label="Nickname *"
          hint="닉네임을 입력하세요."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type your nickname']"
        />
        <q-input
          filled
          v-model="email"
          label="Email *"
          hint="이메일을 입력하세요."
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type your email']"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Password *"
          hint="비밀번호를 입력하세요(14자 이하)."
          lazy-rules
          :rules="[(val) => (val !== null && val !== '') || 'Please type your password']"
        />

        <q-toggle v-model="accept" label="I accept the license and terms" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import axios from 'axios'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const params = new URLSearchParams()
const router = useRouter()

const loginId = ref('123')
const idCheck = ref(null)
const name = ref('123')
const email = ref('123@g.com')
const password = ref('123')
const accept = ref(true)
const loginSuccess = ref(null)

async function handleForm() {
  params.append('loginId', loginId.value)
  params.append('name', name.value)
  params.append('email', email.value)
  params.append('password', password.value)
  const response = await axios.post(`${process.env.SPRING_SERVER}/join`, params)
  if (`${response.data}`.startsWith('[ERROR]')) {
    loginSuccess.value = false
  } else {
    loginSuccess.value = true
  }
}

async function onCheckId() {
  const response = await axios.get(`${process.env.SPRING_SERVER}/join/check-id/${loginId.value}`)
  idCheck.value = response.data
}

async function onSubmitJoin() {
  if (!idCheck.value) {
    $q.notify({
      color: 'red-9',
      textColor: 'white',
      icon: 'warning',
      message: '아이디 중복 확인을 해야 합니다.',
    })
  } else if (accept.value !== true) {
    onResetJoin()
    $q.notify({
      color: 'red-9',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first',
    })
  } else {
    await handleForm()
    if (loginSuccess.value) {
      $q.notify({
        color: 'green-9',
        textColor: 'white',
        icon: 'cloud_done',
        message: '회원가입이 완료되었습니다. 환영합니다.',
      })

      router.push('/login')
    } else {
      $q.notify({
        color: 'red-9',
        textColor: 'white',
        icon: 'warning',
        message: '회원가입을 다시 시도해주세요.',
      })

      onResetJoin()
    }
  }
}

function onResetJoin() {
  loginId.value = null
  name.value = null
  email.value = null
  password.value = null
  accept.value = false

  onResetParams()
}
function onResetParams() {
  params.delete('loginId', null)
  params.delete('name', null)
  params.delete('password', null)
  params.delete('email', null)
}
</script>
