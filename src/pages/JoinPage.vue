<template>
  <q-page class="flex column" style="align-items: center">
    <div class="q-pa-md" style="max-width: 400px">
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
const name = ref('123')
const email = ref('123@g.com')
const password = ref('123')
const accept = ref(true)

async function handleForm() {
  params.append('loginId', loginId.value)
  params.append('name', name.value)
  params.append('email', email.value)
  params.append('password', password.value)
  const response = await axios.post(`${process.env.SPRING_SERVER}/join`, params)
  console.log(response.data)
}

async function onSubmit() {
  if (accept.value !== true) {
    $q.notify({
      color: 'red-9',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first',
    })
  } else {
    await handleForm()
    $q.notify({
      color: 'green-9',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Submitted',
    })
  }
  onResetParams()
  router.push('/login')
}

function onReset() {
  loginId.value = null
  name.value = null
  email.value = null
  password.value = null
  accept.value = false

  onResetParams()
}
function onResetParams() {
  params.delete('loginId')
  params.delete('name')
  params.delete('password')
  params.delete('email')
}
</script>
