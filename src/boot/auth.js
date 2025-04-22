import http from './http'

const params = new URLSearchParams()

export async function login(userId, password) {
  params.delete('username')
  params.delete('password')
  params.append('username', userId)
  params.append('password', password)
  return http.post('/login', params)
}

export async function logout() {
  return http.post(
    '/logout',
    {},
    {
      headers: {
        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh'),
      },
    },
  )
}
