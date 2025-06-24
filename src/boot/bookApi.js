import { api } from './axios'

export async function like(book, user) {
  return await api.post(`/api/v1/memberbooks/like`, {
    bookDto: book,
    username: user,
  })
}

export async function own(book, user) {
  return await api.post(`/api/v1/memberbooks`, {
    bookDto: book,
    username: user,
  })
}
