<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 420px">
      <q-card-section class="q-mb-md text-h6 text-center"> 회원가입 </q-card-section>

      <q-form @submit="onSubmitJoin" @reset="onResetJoin" class="q-gutter-md">
        <!-- 닉네임, 이메일, 비밀번호 -->
        <q-input
          filled
          v-model="name"
          label="Nickname *"
          hint="닉네임을 입력하세요."
          lazy-rules
          :rules="[(val) => !!val || 'Please type your nickname']"
        />
        <q-input
          filled
          v-model="email"
          label="Email *"
          hint="이메일을 입력하세요."
          lazy-rules
          :rules="[(val) => !!val || 'Please type your email']"
        />
        <q-input
          filled
          type="password"
          v-model="password"
          label="Password *"
          hint="비밀번호를 입력하세요 (14자 이하)."
          lazy-rules
          :rules="[(val) => !!val || 'Please type your password']"
        />

        <!-- 약관 동의 -->
        <q-toggle v-model="accept" label="I accept the license and terms" />

        <!-- Submit / Reset -->
        <div class="row justify-between q-mt-sm">
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat />
        </div>
      </q-form>

      <!-- 소셜 로그인 영역 -->
      <q-separator spaced="lg" />
      <div class="column items-center q-gutter-sm">
        <q-btn
          label="Google로 가입하기"
          color="white"
          text-color="black"
          icon="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          outline
          @click="onGoogleLogin"
        />
      </div>
    </q-card>
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

const name = ref('123')
const email = ref('123@g.com')
const password = ref('123')
const accept = ref(true)
const loginSuccess = ref(null)

async function handleForm() {
  const response = await axios.post(`${process.env.SPRING_SERVER}/join`, {
    name: name.value,
    email: email.value,
    password: password.value,
  })
  if (`${response.data}`.startsWith('[ERROR]')) {
    loginSuccess.value = false
  } else {
    loginSuccess.value = true
  }
}

async function onSubmitJoin() {
  if (accept.value !== true) {
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
  name.value = null
  email.value = null
  password.value = null
  accept.value = false

  onResetParams()
}
function onResetParams() {
  params.delete('name', null)
  params.delete('password', null)
  params.delete('email', null)
}
</script>
