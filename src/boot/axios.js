// src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'
// import { useRouter } from 'vue-router'

// API 클라이언트 설정
const api = axios.create({
  baseURL: process.env.SPRING_SERVER,
  timeout: 10000,
  withCredentials: true, // 세션 쿠키를 전송하기 위해
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access')}`,
  },
})

export default boot(({ app }) => {
  // const router = useRouter()

  // 응답 인터셉터 설정
  api.interceptors.response.use(
    (config) => {
      const token = localStorage.getItem('access')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (response) => response,
    async (error) => {
      // 401 Unauthorized 오류 처리
      if (error.response && error.response.status === 401) {
        const data = error.response.data
        // 백엔드에서 보낸 리다이렉트 정보 저장
        if (data.originalRequest) {
          localStorage.setItem('redirectAfterLogin', data.originalRequest)
        }
        if (localStorage.getItem('access')) {
          const newToken = await refreshToken()
          localStorage.setItem('access', newToken)

          error.config.headers['Authorization'] = `Bearer ${newToken}`
          return axios(error.config)
        }
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

async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh')
  try {
    const response = await axios.post(
      `${process.env.SPRING_SERVER}/refresh`,
      {
        refresh: refreshToken,
      },
      {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    )
    console.log(response.data)
  } catch (err) {
    console.error(err)
  }
}

export { api, axios } // 기본 axios 인스턴스도 내보냄
