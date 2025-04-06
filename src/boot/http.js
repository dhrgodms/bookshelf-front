import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.LOCAL_SPRING_SERVER,
  withCredentials: true,
})

export default instance
