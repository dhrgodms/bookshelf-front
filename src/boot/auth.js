import http from './http'

const params = new URLSearchParams()

export async function login(userId, password) {
  params.delete('loginId')
  params.delete('password')
  params.append('loginId', userId)
  params.append('password', password)
  return http.post('/login', params)
}

export async function logout() {
  return http.get('/logout')
}
