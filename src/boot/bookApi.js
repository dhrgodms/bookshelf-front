import { api } from './axios'

export async function like(book) {
  return await api.post(`/api/memberbook/like`, book)
}

export async function own(book) {
  return await api.post(`/api/memberbook/own`, book)
}
