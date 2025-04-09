// src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'
// import { useRouter } from 'vue-router'

// API 클라이언트 설정
const api = axios.create({
  baseURL: process.env.SPRING_SERVER,
  timeout: 10000,
  withCredentials: true, // 세션 쿠키를 전송하기 위해
})

export default boot(({ app, router }) => {
  // const router = useRouter()

  // 응답 인터셉터 설정
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('401처리중')
      // 401 Unauthorized 오류 처리
      if (error.response && error.response.status === 401) {
        const data = error.response.data

        // 백엔드에서 보낸 리다이렉트 정보 저장
        if (data.originalRequest) {
          localStorage.setItem('redirectAfterLogin', data.originalRequest)
        }

        // 로그인 페이지로 이동

        Notify.create({
          type: 'warning',
          message: '로그인이 필요한 서비스입니다.',
        })
        router.push('/login')
      }

      return Promise.reject(error)
    },
  )

  // 전역으로 사용할 수 있도록 등록
  app.config.globalProperties.$api = api
  app.config.globalProperties.$axios = axios
  api.defaults.withCredentials = true
  axios.defaults.withCredentials = true
  app.provide('api', api)
})

export { api, axios } // 기본 axios 인스턴스도 내보냄
