<template>
  <div class="bg_header text-white flex" style="width: 100%; justify-content: center">
    <div style="width: 90%">
      <q-toolbar style="min-height: 6vh">
        <q-btn flat round dense icon="home" class="q-mr-xs" to="/" />

        <q-space />
        <q-btn flat round dense icon="search" class="q-mr-xs" to="/search" />
        <q-btn flat round dense icon="shelves" to="/member/shelf" />
        <q-btn
          v-if="!loggedInState.isLoggedIn"
          flat
          round
          dense
          icon="assignment_ind"
          to="/login"
        />
        <q-btn
          v-if="loggedInState.isLoggedIn"
          flat
          round
          dense
          icon="logout"
          @click="onLogoutClick"
        />
      </q-toolbar>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useLoggedIn } from 'src/stores/loggedIn'
import { useUserInfo } from 'src/stores/userInfo'
import { useRouter } from 'vue-router'
import * as authApi from '../boot/auth'

const $q = useQuasar()
const loggedInState = useLoggedIn()
const userInfoState = useUserInfo()
const router = useRouter()

async function onLogoutClick() {
  const response = await authApi.logout()
  console.log(response.data)
  router.push('/')
  console.log('로그아웃 되었습니다.')
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  loggedInState.logout()
  userInfoState.setUsername('')
  $q.notify({
    color: 'green-9',
    textColor: 'white',
    icon: 'cloud_done',
    message: '로그아웃 되었습니다.',
  })
}
</script>
<style>
.bg_header {
  background-color: #427957;
}
</style>
