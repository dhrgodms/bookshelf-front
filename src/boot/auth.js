import axios from 'axios'
import { getAccessToken, getRefreshToken } from '../utils/auth.js'

export async function login(email, password) {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    email,
    password,
  })
}

export async function logout() {
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/logout`,
    {},
    {
      headers: {
        access: getAccessToken(),
        refresh: getRefreshToken(),
      },
    },
  )
}
