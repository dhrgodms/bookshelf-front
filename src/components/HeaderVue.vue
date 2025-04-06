<template>
  <div class="bg-blue-grey-6 text-white flex" style="width: 100%; justify-content: center">
    <div style="width: 80%">
      <q-toolbar style="min-height: 40px">
        <q-btn flat round dense icon="home" class="q-mr-xs" to="/" />

        <q-space />
        <q-btn flat round dense icon="search" class="q-mr-xs" to="/book/search" />
        <!-- [ ] userId로 구분하는거 설정해야됨 -->
        <q-btn flat round dense icon="shelves" to="/member/shelf/1" />
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

      <q-toolbar inset style="min-height: 25px">
        <q-breadcrumbs active-color="white" style="font-size: 1em">
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el label="Components" icon="widgets" />
          <q-breadcrumbs-el label="Toolbar" />
        </q-breadcrumbs>
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
  if (response.data == 'logoutSuccess') {
    console.log('로그아웃 되었습니다.')
    loggedInState.logout()
    userInfoState.setUsername('')
    router.push('/')
    $q.notify({
      color: 'green-9',
      textColor: 'white',
      icon: 'cloud_done',
      message: '로그아웃 되었습니다.',
    })
  }
}
</script>
