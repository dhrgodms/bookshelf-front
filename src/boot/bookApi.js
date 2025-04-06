// import http from './http'
import { axios } from './axios'

export async function like(book) {
  return axios.post('/api/memberbook/like', book, { withCredentials: true })
}

export async function own(book) {
  return axios.post('/api/memberbook/own', book)
}
