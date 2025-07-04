import { axios } from './axios'

const instance = axios.create({
  baseURL: process.env.SPRING_SERVER,
  withCredentials: true,
})

export default instance
