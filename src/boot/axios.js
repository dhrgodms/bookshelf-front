// src/boot/axios.js
import axios from 'axios'
import { boot } from 'quasar/wrappers'
import { getAccessToken, getRefreshToken } from '../utils/auth.js'
// import { useRouter } from 'vue-router'

// API 클라이언트 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 세션 쿠키를 전송하기 위해
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
})

export default boot(({ app }) => {
  // const router = useRouter()

  // 응답 인터셉터 설정
  api.interceptors.response.use(
    (config) => {
      const token = getAccessToken()
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
        if (getAccessToken()) {
          const newToken = await refreshToken()
          // 새로운 토큰 저장 (유틸리티 함수 사용)
          if (newToken) {
            const { setTokens } = await import('../utils/auth.js')
            setTokens(newToken, getRefreshToken())
          }

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
  const refreshToken = getRefreshToken()
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/refresh`,
      {
        refresh: refreshToken,
      },
      {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    )
    console.log(response.data)
    return response.data.token // 새로운 access token 반환
  } catch (err) {
    console.error(err)
    return null
  }
}

export { api, axios }; // 기본 axios 인스턴스도 내보냄

